package route

import (
	"context"
	"cryptopasta/internal/agent"
	"cryptopasta/internal/app/middleware"
	"cryptopasta/internal/app/websocket"
	"cryptopasta/internal/jwt"
	"cryptopasta/internal/mission"
	"cryptopasta/pkg/utils"
	"log/slog"
	"math/big"
	"net/http"
	"strconv"
	"time"

	"github.com/ethereum/go-ethereum/common"
	"github.com/go-chi/chi/v5"
)

type MissionRoutes struct {
	a agent.Service
	j jwt.Service
	m mission.Service
}

func NewMissionRoutes(a agent.Service, j jwt.Service, m mission.Service) *MissionRoutes {
	return &MissionRoutes{a: a, j: j, m: m}
}

func (m *MissionRoutes) Pattern() string {
	return "/mission"
}

func (m *MissionRoutes) Handler() http.Handler {
	r := chi.NewRouter()

	r.Get("/ws", m.connectWebSocket)

	r.Route("/", func(r chi.Router) {
		r.Use(middleware.JwtTokenRequired(m.j))

		r.Get("/", m.getMissions)
		r.Get("/{missionID}/entries", m.getMissionEntries)
		r.Post("/", m.createMission)
		r.Post("/{missionID}", m.actOnMission)
	})

	return r
}

// Mission list godoc
//
//	@Summary		Get Missions
//	@Description	Get missions by agent id
//	@Tags			mission
//	@Accept			json
//	@Produce		json
//	@Param			lastMissionID	query		string				false	"Last Mission ID"
//	@Param			limit			query		int					false	"Limit"
//	@Success		200				{object}	GetMissionsResponse	"OK"
//	@Failure		400				{string}	string				"Bad Request"
//	@Failure		401				{string}	string				"Unauthorized"
//	@Failure		500				{string}	string				"Internal Server Error"
//	@Router			/mission [get]
//	@Security		BearerAuth
func (m *MissionRoutes) getMissions(w http.ResponseWriter, r *http.Request) {
	// 1. get user id from jwt token
	claims, ok := jwt.FromContext(r.Context())
	if !ok || claims == nil {
		utils.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	userID := claims.UserId

	// 2. get agent address
	agent, err := m.a.FindAgent(r.Context(), userID)
	if err != nil {
		slog.Error("error finding agent", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "no matching agent found")
		return
	}

	// 3. get query params
	query := r.URL.Query()
	lastMissionID := query.Get("lastMissionID")
	limit := query.Get("limit")

	var limitInt int
	if limit != "" {
		var err error
		limitInt, err = strconv.Atoi(limit)
		if err != nil {
			utils.WriteError(w, http.StatusBadRequest, "invalid limit")
			return
		}
	}

	// 4. get missions by agent(user) id and cursor
	missions, err := m.m.GetMissionsByAgentID(r.Context(), agent.UserID, lastMissionID, limitInt)
	if err != nil {
		slog.Error("error getting missions", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error getting missions")
		return
	}

	// 5. prepare response
	var cursor string

	// set cursor for pagination if there are more missions
	if len(missions) > 0 {
		cursor = missions[len(missions)-1].ID
	}

	resp := GetMissionsResponse{
		Missions: missions,
		Cursor:   cursor,
	}

	// 6. write response
	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// Mission entries godoc
//
//	@Summary		Get Mission Entries
//	@Description	Get mission entries by mission id
//	@Tags			mission
//	@Accept			plain
//	@Produce		json
//	@Param			missionID	path		string			true	"Mission ID"
//	@Success		200			{array}		mission.Entry	"OK"
//	@Failure		400			{string}	string			"Bad Request"
//	@Failure		401			{string}	string			"Unauthorized"
//	@Failure		500			{string}	string			"Internal Server Error"
//	@Router			/mission/{missionID}/entries [get]
//	@Security		BearerAuth
func (m *MissionRoutes) getMissionEntries(w http.ResponseWriter, r *http.Request) {
	// 1. get mission id
	missionID := chi.URLParam(r, "missionID")

	// 2. get mission entries by mission id
	entries, err := m.m.GetEntriesByMissionID(r.Context(), missionID)
	if err != nil {
		slog.Error("error getting mission entries", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error getting mission entries")
		return
	}

	// 3. prepare response
	resp := GetEntriesResponse{
		MissionID: missionID,
		Entries:   entries,
	}

	// 4. write response
	_ = utils.WriteJSON(w, http.StatusOK, resp)
}

// Mission websocket godoc
//
//	@Summary		Connect WebSocket
//	@Description	Connect to a mission via websocket
//	@Tags			mission
//	@Accept			plain
//	@Produce		plain
//	@Param			token	query	string	true	"Access Token"
//	@Router			/mission/ws [get]
func (m *MissionRoutes) connectWebSocket(w http.ResponseWriter, r *http.Request) {
	// 1. get jwt token from query params
	tokenStr := r.URL.Query().Get("token")

	// 2. parse and validate jwt token
	token, err := m.j.ParseToken(tokenStr)
	if err != nil {
		slog.Error("error parsing token", "error", err)
		http.Error(w, "invalid token", http.StatusBadRequest)
		return
	}

	_, err = m.j.ValidateClaims(token)
	if err != nil {
		slog.Error("error validating token", "error", err)
		http.Error(w, "invalid token", http.StatusBadRequest)
		return
	}

	// 3. upgrade connection to websocket
	websocket.Serve(w, r)
}

// Mission create godoc
//
//	@Summary		Create Mission
//	@Description	Create a new mission
//	@Tags			mission
//	@Accept			json
//	@Produce		json
//	@Param			sessionID	query		string					true	"Session ID"
//	@Param			reportID	query		string					true	"Report ID"
//	@Success		200			{object}	mission.Mission			"OK"
//	@Failure		400			{string}	string					"Bad Request"
//	@Failure		401			{string}	string					"Unauthorized"
//	@Failure		500			{string}	string					"Internal Server Error"
//	@Router			/mission [post]
//	@Security		BearerAuth
func (m *MissionRoutes) createMission(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("sessionID")
	reportID := r.URL.Query().Get("reportID")

	// 2. validate session id and report id
	id := websocket.ID(sessionID)
	if !id.Valid() {
		utils.WriteError(w, http.StatusBadRequest, "invalid session id")
		return
	}

	reportIdBN, ok := new(big.Int).SetString(reportID, 10)
	if !ok {
		utils.WriteError(w, http.StatusBadRequest, "invalid report id")
		return
	}

	// 2. get user id from jwt token
	claims, ok := jwt.FromContext(r.Context())
	if !ok || claims == nil {
		utils.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	userID := claims.UserId

	// 3. get agent by user id for checking agent existence
	agent, err := m.a.FindAgent(r.Context(), userID)
	if err != nil {
		slog.Error("error finding agent", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "no matching agent found")
		return
	}

	// 4. create chat function for sending messages via websocket
	chatFn := mission.ChatMessageFunc(func(message string) error {
		websocket.Send(websocket.Message{
			Type: websocket.EventMessage,
			ID:   id,
			Event: websocket.Event{
				Name:   "chat",
				Data:   message,
				Status: websocket.InProgress,
			},
		})
		return nil
	})

	// 5. send response
	w.WriteHeader(http.StatusOK)

	// 6. create mission in background and send response via websocket
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
		defer cancel()

		agentAccountAddress := common.HexToAddress(agent.AccountAddress)

		mission, err := m.m.CreateMission(ctx, agent.ID, agentAccountAddress, reportIdBN, chatFn)
		if err != nil {
			slog.Error("error creating mission", "error", err)
			websocket.Send(websocket.Message{
				Type: websocket.ErrorMessage,
				ID:   id,
				Event: websocket.Event{
					Name:   "mission_create_error",
					Data:   "error creating mission",
					Status: websocket.Error,
				},
			})
			return
		}

		websocket.Send(websocket.Message{
			Type: websocket.EventMessage,
			ID:   id,
			Event: websocket.Event{
				Name:   "mission_create_success",
				Data:   mission,
				Status: websocket.Done,
			},
		})
	}()
}

// Mission act godoc
//
//	@Summary		Act On Mission
//	@Description	Act on a mission
//	@Tags			mission
//	@Accept			json
//	@Produce		plain
//	@Param			missionID	path		string				true	"Mission ID"
//	@Param			sessionID	query		string				true	"Session ID"
//	@Param			request		body		ActOnMissionRequest	true	"Act On Mission Request"
//	@Success		200			{string}	string				"OK"
//	@Failure		400			{string}	string				"Bad Request"
//	@Failure		401			{string}	string				"Unauthorized"
//	@Failure		500			{string}	string				"Internal Server Error"
//	@Router			/mission/{missionID} [post]
//	@Security		BearerAuth
func (m *MissionRoutes) actOnMission(w http.ResponseWriter, r *http.Request) {
	// 1. get mission id and session id
	missionID := chi.URLParam(r, "missionID")
	sessionID := r.URL.Query().Get("sessionID")

	// 2. validate session id
	id := websocket.ID(sessionID)
	if !id.Valid() {
		utils.WriteError(w, http.StatusBadRequest, "invalid session id")
		return
	}

	// 3. read request body
	var req ActOnMissionRequest

	if err := utils.ReadJSON(w, r, &req); err != nil {
		slog.Error("error reading request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	chatFn := mission.ChatMessageFunc(func(message string) error {
		websocket.Send(websocket.Message{
			Type: websocket.EventMessage,
			ID:   id,
			Event: websocket.Event{
				Name:   "chat",
				Data:   message,
				Status: websocket.InProgress,
			},
		})
		return nil
	})

	w.WriteHeader(http.StatusOK)

	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 3*time.Minute)
		defer cancel()

		entryID, err := m.m.ActOnMission(ctx, missionID, req.Input, chatFn)
		if err != nil {
			slog.Error("error acting on mission", "error", err)
			websocket.Send(websocket.Message{
				Type: websocket.ErrorMessage,
				ID:   id,
				Event: websocket.Event{
					Name:   "mission_act_error",
					Data:   "error acting on mission",
					Status: websocket.Error,
				},
			})
			return
		}

		visualMessage, err := m.m.VisualizeLatestMissionState(ctx, missionID, entryID)
		if err != nil {
			slog.Error("error visualizing mission state", "error", err)
			websocket.Send(websocket.Message{
				Type: websocket.ErrorMessage,
				ID:   id,
				Event: websocket.Event{
					Name:   "mission_visualize_error",
					Data:   "error visualizing mission state",
					Status: websocket.Error,
				},
			})
			return
		}

		if visualMessage != nil {
			websocket.Send(websocket.Message{
				Type: websocket.EventMessage,
				ID:   id,
				Event: websocket.Event{
					Name:   "mission_act_success",
					Data:   ActOnMissionResponse{EntryID: entryID, VisualMessage: *visualMessage},
					Status: websocket.Done,
				},
			})
		}
	}()
}

type GetMissionsResponse struct {
	Missions []mission.Mission `json:"missions"`
	Cursor   string            `json:"cursor,omitempty"`
}

type GetEntriesResponse struct {
	MissionID string          `json:"missionID"`
	Entries   []mission.Entry `json:"entries"`
}

type ActOnMissionRequest struct {
	Input string `json:"input"`
}

type ActOnMissionResponse struct {
	EntryID       string          `json:"entryID"`
	VisualMessage mission.Message `json:"visualMessage"`
}

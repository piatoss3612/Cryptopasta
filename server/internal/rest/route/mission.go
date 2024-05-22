package route

import (
	"context"
	"cryptopasta/internal/rest/middleware"
	"cryptopasta/internal/rest/websocket"
	"cryptopasta/internal/service/jwt"
	"cryptopasta/internal/service/mission"
	"cryptopasta/internal/utils"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
)

type MissionRoutes struct {
	j *jwt.JwtService
	m *mission.MissionService
}

func NewMissionRoutes(j *jwt.JwtService, m *mission.MissionService) *MissionRoutes {
	return &MissionRoutes{j: j, m: m}
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
//	@Param			agentID			query		string				true	"Agent ID"
//	@Param			lastMissionID	query		string				false	"Last Mission ID"
//	@Param			limit			query		int					false	"Limit"
//	@Success		200				{object}	GetMissionsResponse	"OK"
//	@Failure		400				{string}	string				"Bad Request"
//	@Failure		401				{string}	string				"Unauthorized"
//	@Failure		500				{string}	string				"Internal Server Error"
//	@Router			/mission [get]
//	@Security		BearerAuth
func (m *MissionRoutes) getMissions(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	agentID := query.Get("agentID")
	lastMissionID := query.Get("lastMissionID")
	limit := query.Get("limit")

	if agentID == "" {
		utils.WriteError(w, http.StatusBadRequest, "missing agent id")
		return
	}

	var limitInt int
	if limit != "" {
		var err error
		limitInt, err = strconv.Atoi(limit)
		if err != nil {
			utils.WriteError(w, http.StatusBadRequest, "invalid limit")
			return
		}
	}

	agentID = strings.ToLower(agentID)

	missions, err := m.m.GetMissionsByAgentID(r.Context(), agentID, lastMissionID, limitInt)
	if err != nil {
		slog.Error("error getting missions", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error getting missions")
		return
	}

	var cursor string

	if len(missions) > 0 {
		cursor = missions[len(missions)-1].ID
	}

	resp := GetMissionsResponse{
		Missions: missions,
		Cursor:   cursor,
	}

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
	missionID := chi.URLParam(r, "missionID")

	entries, err := m.m.GetEntriesByMissionID(r.Context(), missionID)
	if err != nil {
		slog.Error("error getting mission entries", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error getting mission entries")
		return
	}

	resp := GetEntriesResponse{
		MissionID: missionID,
		Entries:   entries,
	}

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
	tokenStr := r.URL.Query().Get("token")

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
//	@Param			request		body		CreateMissionRequest	true	"Create Mission Request"
//	@Success		200			{object}	mission.Mission			"OK"
//	@Failure		400			{string}	string					"Bad Request"
//	@Failure		401			{string}	string					"Unauthorized"
//	@Failure		500			{string}	string					"Internal Server Error"
//	@Router			/mission [post]
//	@Security		BearerAuth
func (m *MissionRoutes) createMission(w http.ResponseWriter, r *http.Request) {
	sessionID := r.URL.Query().Get("sessionID")

	// 2. validate session id
	id := websocket.ID(sessionID)
	if !id.Valid() {
		utils.WriteError(w, http.StatusBadRequest, "invalid session id")
		return
	}

	// 3. read request body
	var req CreateMissionRequest

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

		mission, err := m.m.CreateMission(ctx, req.AgentID, req.ReportID, chatFn)
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

		imageB64JSON, err := m.m.VisualizeLatestMissionState(ctx, missionID, entryID)
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

		websocket.Send(websocket.Message{
			Type: websocket.EventMessage,
			ID:   id,
			Event: websocket.Event{
				Name:   "mission_act_success",
				Data:   ActOnMissionResponse{EntryID: entryID, ImageB64JSON: imageB64JSON},
				Status: websocket.Done,
			},
		})
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

type CreateMissionRequest struct {
	AgentID  string `json:"agent_id"`
	ReportID string `json:"report_id"`
}

type ActOnMissionRequest struct {
	Input string `json:"input"`
}

type ActOnMissionResponse struct {
	EntryID      string `json:"entryID"`
	ImageB64JSON string `json:"imageB64JSON"`
}

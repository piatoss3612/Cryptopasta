package route

import (
	"context"
	"cryptopasta/internal/rest/middleware"
	"cryptopasta/internal/rest/sse"
	"cryptopasta/internal/service/jwt"
	"cryptopasta/internal/service/mission"
	"cryptopasta/internal/utils"
	"log/slog"
	"net/http"

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
	r.Use(middleware.JwtTokenRequired(m.j))

	r.Get("/", m.getMissions)
	r.Get("/{missionID}/entries", m.getMissionEntries)
	r.Post("/", m.createMission)
	r.Post("/{missionID}", m.actOnMission)

	return r
}

// Mission list godoc
//
//	@Summary		Get Missions
//	@Description	Get missions by agent id
//	@Tags			mission
//	@Accept			json
//	@Produce		json
//	@Param			request	body		GetMissionsRequest	true	"Get Missions Request"
//	@Success		200		{object}	GetMissionsResponse	"OK"
//	@Failure		400		{string}	string				"Bad Request"
//	@Failure		401		{string}	string				"Unauthorized"
//	@Failure		500		{string}	string				"Internal Server Error"
//	@Router			/mission [get]
//	@Security		BearerAuth
func (m *MissionRoutes) getMissions(w http.ResponseWriter, r *http.Request) {
	var req GetMissionsRequest

	if err := utils.ReadJSON(w, r, &req); err != nil {
		slog.Error("error reading request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	missions, err := m.m.GetMissionsByAgentID(r.Context(), req.AgentID, req.LastMissionID, req.Limit)
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

	_ = utils.WriteJSON(w, http.StatusOK, entries)
}

// Mission create godoc
//
//	@Summary		Create Mission
//	@Description	Create a new mission
//	@Tags			mission
//	@Accept			json
//	@Produce		json
//	@Param			request	body		CreateMissionRequest	true	"Create Mission Request"
//	@Success		200		{object}	mission.Mission			"OK"
//	@Failure		400		{string}	string					"Bad Request"
//	@Failure		401		{string}	string					"Unauthorized"
//	@Failure		500		{string}	string					"Internal Server Error"
//	@Router			/mission [post]
//	@Security		BearerAuth
func (m *MissionRoutes) createMission(w http.ResponseWriter, r *http.Request) {
	var req CreateMissionRequest

	if err := utils.ReadJSON(w, r, &req); err != nil {
		slog.Error("error reading request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	sw, err := sse.NewStreamWriter(w)
	if err != nil {
		slog.Error("error creating stream writer", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error creating stream writer")
		return
	}

	streamFunc := mission.StreamFunc(func(ctx context.Context, chunk []byte) error {
		return sw.WriteEvent(&sse.Event{
			Type: "chunk",
			Data: string(chunk),
		})
	})

	mission, err := m.m.CreateMission(r.Context(), req.AgentID, req.ReportID, streamFunc)
	if err != nil {
		slog.Error("error creating mission", "error", err)
		sw.WriteEvent(&sse.Event{
			Type: "mission_create_error",
			Data: "error creating mission",
		})
		return
	}

	if err := sw.WriteEvent(&sse.Event{
		Type: "mission_create_success",
		Data: mission,
	}); err != nil {
		slog.Error("error writing event", "error", err)
	}
}

// Mission act godoc
//
//	@Summary		Act On Mission
//	@Description	Act on a mission
//	@Tags			mission
//	@Accept			json
//	@Produce		plain
//	@Param			missionID	path		string				true	"Mission ID"
//	@Param			request		body		ActOnMissionRequest	true	"Act On Mission Request"
//	@Success		200			{string}	string				"OK"
//	@Failure		400			{string}	string				"Bad Request"
//	@Failure		401			{string}	string				"Unauthorized"
//	@Failure		500			{string}	string				"Internal Server Error"
//	@Router			/mission/{missionID} [post]
//	@Security		BearerAuth
func (m *MissionRoutes) actOnMission(w http.ResponseWriter, r *http.Request) {
	missionID := chi.URLParam(r, "missionID")

	var req ActOnMissionRequest

	if err := utils.ReadJSON(w, r, &req); err != nil {
		slog.Error("error reading request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	sw, err := sse.NewStreamWriter(w)
	if err != nil {
		slog.Error("error creating stream writer", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "error creating stream writer")
		return
	}

	streamFunc := mission.StreamFunc(func(ctx context.Context, chunk []byte) error {
		return sw.WriteEvent(&sse.Event{
			Type: "chunk",
			Data: string(chunk),
		})
	})

	if err := m.m.ActOnMission(r.Context(), missionID, req.Input, streamFunc); err != nil {
		slog.Error("error acting on mission", "error", err)
		sw.WriteEvent(&sse.Event{
			Type: "mission_act_error",
			Data: "error acting on mission",
		})
		return
	}
}

type GetMissionsRequest struct {
	AgentID       string `json:"agent_id"`
	LastMissionID string `json:"last_mission_id,omitempty"`
	Limit         int    `json:"limit,omitempty"`
}

type GetMissionsResponse struct {
	Missions []mission.Mission `json:"missions"`
	Cursor   string            `json:"cursor,omitempty"`
}

type CreateMissionRequest struct {
	AgentID  string `json:"agent_id"`
	ReportID string `json:"report_id"`
}

type ActOnMissionRequest struct {
	Input string `json:"input"`
}

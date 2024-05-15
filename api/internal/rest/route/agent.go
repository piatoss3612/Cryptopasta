package route

import (
	"cryptopasta-api/internal/rest/middleware"
	"cryptopasta-api/internal/rest/sse"
	"cryptopasta-api/internal/service/agent"
	"cryptopasta-api/internal/service/jwt"
	"cryptopasta-api/internal/utils"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type AgentRoute struct {
	j *jwt.JwtService
	r *agent.AgentService
}

func NewAgentRoute(j *jwt.JwtService, r *agent.AgentService) *AgentRoute {
	return &AgentRoute{j: j, r: r}
}

func (a *AgentRoute) Pattern() string {
	return "/agent"
}

func (a *AgentRoute) Handler() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.JwtTokenRequired(a.j))
	r.Post("/", a.register)
	return r
}

// Agent Register godoc
//
//	@Summary		Agent Register
//	@Description	Register a new agent to the system
//	@Tags			agent
//	@Accept			json
//	@Produce		plain
//	@Param			request	body		AgentRegisterRequest	true	"Agent Register Request"
//	@Success		200		{string}	string					"OK"
//	@Failure		400		{string}	string					"Bad Request"
//	@Failure		401		{string}	string					"Unauthorized"
//	@Router			/agent [post]
//	@Security		BearerAuth
func (a *AgentRoute) register(w http.ResponseWriter, r *http.Request) {

	// 1. decode request body
	var req AgentRegisterRequest

	err := utils.ReadJSON(w, r, &req)
	if err != nil {
		slog.Error("error while decoding request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// 2. create stream writer
	sw, err := sse.NewStreamWriter(w)
	if err != nil {
		slog.Error("error while creating stream writer", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "streaming unsupported")
		return
	}

	// 3. send message to initiate agent registration
	err = sw.WriteEvent(&sse.Event{
		Type: "agent_register_start",
		Data: "start agent registration",
	})
	if err != nil {
		slog.Error("error while writing event", "error", err)
		return
	}

	// 4. register agent
	account, tokenId, err := a.r.RegisterAgent(r.Context(), req.AgentAddress, req.PortraitId)
	if err != nil {
		slog.Error("agent registration failed", "error", err)
		_ = sw.WriteEvent(&sse.Event{
			Type: "agent_register_error",
			Data: err.Error(),
		})
		return
	}

	// 5. send message to initiate token creation
	err = sw.WriteEvent(&sse.Event{
		Type: "agent_register_success",
		Data: AgentRegisterResponse{
			AgentAccount: account.Hex(),
			TokenId:      tokenId.String(),
		},
	})
	if err != nil {
		slog.Error("error while writing event", "error", err)
		return
	}

}

type AgentRegisterRequest struct {
	AgentAddress string `json:"agent_address"`
	PortraitId   string `json:"portrait_id"`
}

type AgentRegisterResponse struct {
	AgentAccount string `json:"agent_account"`
	TokenId      string `json:"token_id"`
}

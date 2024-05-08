package route

import (
	"context"
	"cryptopasta-api/internal/rest/middleware"
	"cryptopasta-api/internal/rest/websocket"
	"cryptopasta-api/internal/service/agent"
	"cryptopasta-api/internal/service/jwt"
	"cryptopasta-api/internal/utils"
	"log/slog"
	"net/http"
	"time"

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
//	@Param			sessionId		query		string	true	"Session ID"
//	@Param			agent_address	body		string	true	"Agent Address"
//	@Param			portrait_id		body		string	true	"Portrait ID"
//	@Success		202				{string}	string	"Accepted"
//	@Router			/agent [post]
//	@Security		BearerAuth
func (a *AgentRoute) register(w http.ResponseWriter, r *http.Request) {
	// 1. get session id from query params
	sessionId := r.URL.Query().Get("sessionId")

	// 2. validate session id
	id := websocket.ID(sessionId)
	if !id.Valid() {
		utils.WriteError(w, http.StatusBadRequest, "invalid session id")
		return
	}

	// 3. decode request body
	var req AgentRegisterRequest

	err := utils.ReadJSON(w, r, &req)
	if err != nil {
		slog.Error("error while decoding request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// 4. register agent in goroutine
	go func() {
		// 1. send websocket message to initiate agent registration
		go websocket.Send(websocket.Message{
			ID:   id,
			Type: websocket.EventMessage,
			Event: websocket.Event{
				Name:   "agent_register",
				Status: websocket.InProgress,
			},
		})

		ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
		defer cancel()

		// 2. register agent
		account, tokenId, err := a.r.RegisterAgent(ctx, req.AgentAddress, req.PortraitId)
		if err != nil {
			slog.Error("agent registration failed", "error", err)
			go websocket.Send(websocket.Message{
				ID:   id,
				Type: websocket.ErrorMessage,
				Event: websocket.Event{
					Name:   "agent_register",
					Status: websocket.Error,
					Data:   "agent registration failed",
				},
			})
			return
		}

		// 3. send websocket message to confirm agent registration
		go websocket.Send(websocket.Message{
			ID:   id,
			Type: websocket.EventMessage,
			Event: websocket.Event{
				Name:   "agent_register",
				Status: websocket.Done,
				Data: AgentRegisterResponse{
					AgentAccount: account.Hex(),
					TokenId:      tokenId.String(),
				},
			},
		})
	}()

	// 5. send accepted response
	w.WriteHeader(http.StatusAccepted)
}

type AgentRegisterRequest struct {
	AgentAddress string `json:"agent_address"`
	PortraitId   string `json:"portrait_id"`
}

type AgentRegisterResponse struct {
	AgentAccount string `json:"agent_account"`
	TokenId      string `json:"token_id"`
}

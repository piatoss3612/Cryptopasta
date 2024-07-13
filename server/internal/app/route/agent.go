package route

import (
	"context"
	"cryptopasta/internal/agent"
	"cryptopasta/internal/app/middleware"
	"cryptopasta/internal/jwt"
	"cryptopasta/pkg/db"
	"cryptopasta/pkg/utils"
	"log/slog"
	"math/big"
	"net/http"

	"github.com/ethereum/go-ethereum/common"
	"github.com/go-chi/chi/v5"
)

type AgentRoute struct {
	j  jwt.Service
	r  agent.Service
	tx db.Tx
}

func NewAgentRoutes(j jwt.Service, r agent.Service, tx db.Tx) *AgentRoute {
	return &AgentRoute{j: j, r: r, tx: tx}
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
//	@Produce		json
//	@Param			request	body		AgentRegisterRequest	true	"Agent Register Request"
//	@Success		201		{object}	AgentRegisterResponse	"Created"
//	@Failure		400		{string}	string					"Bad Request"
//	@Failure		401		{string}	string					"Unauthorized"
//	@Router			/agent [post]
//	@Security		BearerAuth
func (a *AgentRoute) register(w http.ResponseWriter, r *http.Request) {
	// 1. get user id from jwt token
	claims, ok := jwt.FromContext(r.Context())
	if !ok || claims == nil {
		utils.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	userID := claims.UserId

	if userID == "" {
		utils.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	// 2. decode request body
	var req AgentRegisterRequest

	err := utils.ReadJSON(w, r, &req)
	if err != nil {
		slog.Error("error while decoding request body", "error", err)
		utils.WriteError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	agentAddrBytes := common.HexToAddress(req.AgentAddress)
	portraitIdBn, ok := big.NewInt(0).SetString(req.PortraitId, 10)
	if !ok {
		utils.WriteError(w, http.StatusBadRequest, "invalid portrait id")
		return
	}

	fn := func(ctx context.Context) (interface{}, error) {
		return a.r.RegisterAgent(ctx, userID, agentAddrBytes, portraitIdBn)
	}

	// 3. register agent
	result, err := a.tx.Execute(r.Context(), fn)
	if err != nil {
		slog.Error("error while registering agent", "error", err)
		utils.WriteError(w, http.StatusInternalServerError, "failed to register agent")
		return
	}

	agent, ok := result.(*agent.Agent)
	if !ok {
		utils.WriteError(w, http.StatusInternalServerError, "agent not found")
		return
	}

	// 4. send response
	_ = utils.WriteJSON(w, http.StatusCreated, AgentRegisterResponse{
		AgentAccount: agent.AccountAddress,
	})
}

type AgentRegisterRequest struct {
	AgentAddress string `json:"agent_address"`
	PortraitId   string `json:"portrait_id"`
}

type AgentRegisterResponse struct {
	AgentAccount string `json:"agent_account"`
}

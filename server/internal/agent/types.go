package agent

import (
	"context"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

type Service interface {
	RegisterAgent(ctx context.Context, userID string, agentAddrBytes common.Address, portraitId *big.Int) (*Agent, error)
	FindAgent(ctx context.Context, userID string) (*Agent, error)
}

type Registerer interface {
	Register(ctx context.Context, agentAddrBytes common.Address, portraitId *big.Int) (common.Address, error)
}

// Repository for agent.
type Repository interface {
	Querier
	Commander
}

// Querier is the interface for querying agent.
type Querier interface {
	FindAgentByID(ctx context.Context, id string) (*Agent, error)
	FindAgentByUserID(ctx context.Context, userID string) (*Agent, error)
	AgentExists(ctx context.Context, userID string) (bool, error)
}

// Commander is the interface for creating agent.
type Commander interface {
	CreateAgent(ctx context.Context, userID, agentAddress, accountAddress string) (*Agent, error)
}

type Agent struct {
	ID             string `json:"id" bson:"_id,omitempty"`
	UserID         string `json:"userID" bson:"userID"`
	AgentAddress   string `json:"agentAddress" bson:"agentAddress"`
	AccountAddress string `json:"accountAddress" bson:"accountAddress"`
}

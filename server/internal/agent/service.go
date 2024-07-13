package agent

import (
	"context"
	"errors"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

var (
	ErrUserAlreadyRegistered = errors.New("user already registered")
	ErrInvalidPortraitID     = errors.New("invalid portrait id")
)

// Service is the agent service.
type service struct {
	register Registerer
	repo     Repository
}

func NewService(register Registerer, repo Repository) *service {
	return &service{
		register: register,
		repo:     repo,
	}
}

func (s *service) RegisterAgent(ctx context.Context, userID string, agentAddrBytes common.Address, portraitId *big.Int) (*Agent, error) {
	// Check if user is exist
	exist, err := s.repo.AgentExists(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Check if user is already registered
	if exist {
		return nil, ErrUserAlreadyRegistered
	}

	// Register the agent
	account, err := s.register.Register(ctx, agentAddrBytes, portraitId)
	if err != nil {
		return nil, err
	}

	// Store the agent in the database
	return s.repo.CreateAgent(ctx, userID, agentAddrBytes.Hex(), account.Hex())
}

func (s *service) FindAgent(ctx context.Context, userID string) (*Agent, error) {
	return s.repo.FindAgentByUserID(ctx, userID)
}

var _ Service = (*service)(nil)

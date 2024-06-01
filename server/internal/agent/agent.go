package agent

import (
	"context"
	"crypto/ecdsa"
	"cryptopasta/pkg/contracts"
	"cryptopasta/pkg/mongo"
	"errors"
	"log"
	"math/big"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/zksync-sdk/zksync2-go/clients"
)

const (
	TxStatusSuccess     = 1
	zkSyncSepoliaRpcUrl = "https://sepolia.era.zksync.dev"
)

type Service struct {
	client     clients.Client
	registry   *contracts.AgentRegistry
	tx         *mongo.Tx
	query      *Query
	store      *Store
	privateKey *ecdsa.PrivateKey
}

func NewService(client clients.Client, registry *contracts.AgentRegistry, tx *mongo.Tx, privateKeyStr string) *Service {
	privateKey, err := crypto.HexToECDSA(privateKeyStr)
	if err != nil {
		log.Fatal(err)
	}

	return &Service{
		client:     client,
		registry:   registry,
		tx:         tx,
		query:      NewQuery(tx.Client, tx.DBName),
		store:      NewStore(tx.Client, tx.DBName),
		privateKey: privateKey,
	}
}

func (s *Service) RegisterAgent(ctx context.Context, userID, agentAddr string, portraitId string) (*Agent, error) {
	// 1. Check if user is exist
	exist, err := s.query.AgentExists(ctx, userID)
	if err != nil {
		return nil, err
	}

	if exist {
		return nil, errors.New("user already registered")
	}

	// 2. Setup Transaction function
	fn := func(ctx context.Context) (interface{}, error) {
		agentAddrBytes := common.HexToAddress(agentAddr)
		callOpts := callOpts(ctx)

		// Check if agent is already registered
		ok, err := s.registry.IsRegisteredAgent(callOpts, agentAddrBytes)
		if err != nil {
			return nil, err
		}

		// If agent is already registered, it means that the agent is registered but not stored in the database
		if ok {
			// Get the account of the agent
			account, err := s.registry.AgentToAccount(callOpts, agentAddrBytes)
			if err != nil {
				return nil, err
			}

			// Store the agent in the database
			return s.store.CreateAgent(ctx, userID, agentAddr, account.Hex())
		}

		// Check if agent address is account address
		ok, err = s.registry.IsRegisteredAccount(callOpts, agentAddrBytes)
		if err != nil {
			return nil, err
		}

		// Account is not allowed to register as an agent to prevent recursive registration
		if ok {
			return nil, errors.New("account is not allowed to register as an agent")
		}

		// Check if portrait id is valid
		portraitIdBigInt, ok := new(big.Int).SetString(portraitId, 10)
		if !ok {
			return nil, errors.New("invalid portrait id")
		}

		// Get the signer
		auth, err := s.txOpts(ctx)
		if err != nil {
			return nil, err
		}

		// Register the agent
		tx, err := s.registry.Register(auth, agentAddrBytes, portraitIdBigInt)
		if err != nil {
			return nil, err
		}

		// Wait for the transaction to be mined
		receipt, err := s.client.WaitMined(ctx, tx.Hash())
		if err != nil {
			return nil, err
		}

		if receipt.Status != TxStatusSuccess {
			return nil, errors.New("transaction failed")
		}

		// Parse the event to get the account of the agent
		var event *contracts.AgentRegistryAgentRegistered

		for _, log := range receipt.Logs {
			event, err = s.registry.ParseAgentRegistered(log.Log)
			if err == nil {
				break
			}
		}

		if event == nil {
			return nil, errors.New("event not found")
		}

		account := event.Account

		// Store the agent in the database
		return s.store.CreateAgent(ctx, userID, agentAddrBytes.Hex(), account.Hex())
	}

	// 3. Execute the transaction
	result, err := s.tx.Execute(ctx, fn)
	if err != nil {
		return nil, err
	}

	// 4. Check the result
	agent, ok := result.(*Agent)
	if !ok {
		return nil, errors.New("invalid agent type")
	}

	return agent, nil
}

func (s *Service) FindAgent(ctx context.Context, userID string) (*Agent, error) {
	return s.query.FindAgentByUserID(ctx, userID)
}

func (s *Service) txOpts(ctx context.Context) (*bind.TransactOpts, error) {
	address := crypto.PubkeyToAddress(s.privateKey.PublicKey)

	nonce, err := s.client.PendingNonceAt(ctx, address)
	if err != nil {
		return nil, err
	}

	gasPrice, err := s.client.SuggestGasPrice(ctx)
	if err != nil {
		return nil, err
	}

	chainID, err := s.client.ChainID(ctx)
	if err != nil {
		return nil, err
	}

	auth, err := bind.NewKeyedTransactorWithChainID(s.privateKey, chainID)
	if err != nil {
		return nil, err
	}

	auth.GasPrice = gasPrice
	auth.Nonce = big.NewInt(int64(nonce))
	auth.GasLimit = 50000000

	return auth, nil
}

func callOpts(ctx context.Context) *bind.CallOpts {
	return &bind.CallOpts{
		Context: ctx,
	}
}

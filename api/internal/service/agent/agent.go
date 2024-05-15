package agent

import (
	"context"
	"crypto/ecdsa"
	"cryptopasta-api/pkg/contracts"
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

type AgentService struct {
	client     clients.Client
	registry   *contracts.AgentRegistry
	privateKey *ecdsa.PrivateKey
}

func NewAgentService(ctx context.Context, contractAddr string, privateKeyStr string) *AgentService {
	privateKey, err := crypto.HexToECDSA(privateKeyStr)
	if err != nil {
		log.Fatal(err)
	}

	client, err := clients.DialContext(ctx, zkSyncSepoliaRpcUrl)
	if err != nil {
		log.Fatal(err)
	}

	agentRegistryAddr := common.HexToAddress(contractAddr)

	registry, err := contracts.NewAgentRegistry(agentRegistryAddr, client)
	if err != nil {
		log.Fatal(err)
	}

	return &AgentService{
		client:     client,
		registry:   registry,
		privateKey: privateKey,
	}
}

func (a *AgentService) RegisterAgent(ctx context.Context, agentAddr string, portraitId string) (common.Address, *big.Int, error) {
	agent := common.HexToAddress(agentAddr)
	callOpts := a.callOpts(ctx)

	ok, err := a.registry.IsRegisteredAgent(callOpts, agent)
	if err != nil {
		return common.Address{}, nil, err
	}

	if ok {
		return common.Address{}, nil, errors.New("agent already registered")
	}

	ok, err = a.registry.IsRegisteredAccount(callOpts, agent)
	if err != nil {
		return common.Address{}, nil, err
	}

	if ok {
		return common.Address{}, nil, errors.New("account is not allowed to register as an agent")
	}

	portraitIdBigInt, ok := new(big.Int).SetString(portraitId, 10)
	if !ok {
		return common.Address{}, nil, errors.New("invalid portrait id")
	}

	auth, err := a.txOpts(ctx)
	if err != nil {
		return common.Address{}, nil, err
	}

	tx, err := a.registry.Register(auth, agent, portraitIdBigInt)
	if err != nil {
		return common.Address{}, nil, err
	}

	receipt, err := a.client.WaitMined(ctx, tx.Hash())
	if err != nil {
		return common.Address{}, nil, err
	}

	if receipt.Status != TxStatusSuccess {
		return common.Address{}, nil, errors.New("transaction failed")
	}

	var event *contracts.AgentRegistryAgentRegistered

	for _, log := range receipt.Logs {
		event, err = a.registry.ParseAgentRegistered(log.Log)
		if err == nil {
			break
		}
	}

	if event == nil {
		return common.Address{}, nil, errors.New("event not found")
	}

	account := event.Account
	tokenId := event.TokenId

	return account, tokenId, nil
}

func (a *AgentService) Close() {
	a.client.Close()
}

func (a *AgentService) callOpts(ctx context.Context) *bind.CallOpts {
	return &bind.CallOpts{
		Context: ctx,
	}
}

func (a *AgentService) txOpts(ctx context.Context) (*bind.TransactOpts, error) {
	address := crypto.PubkeyToAddress(a.privateKey.PublicKey)

	nonce, err := a.client.PendingNonceAt(ctx, address)
	if err != nil {
		return nil, err
	}

	gasPrice, err := a.client.SuggestGasPrice(ctx)
	if err != nil {
		return nil, err
	}

	chainID, err := a.client.ChainID(ctx)
	if err != nil {
		return nil, err
	}

	auth, err := bind.NewKeyedTransactorWithChainID(a.privateKey, chainID)
	if err != nil {
		return nil, err
	}

	auth.GasPrice = gasPrice
	auth.Nonce = big.NewInt(int64(nonce))
	auth.GasLimit = 30000000

	return auth, nil
}

package agent

import (
	"context"
	"crypto/ecdsa"
	"cryptopasta/pkg/contracts"
	"errors"
	"math/big"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/zksync-sdk/zksync2-go/clients"
	"github.com/zksync-sdk/zksync2-go/types"
)

const TxStatusSuccess = 1

var ErrAccountNotAllowed = errors.New("account is not allowed to register as an agent")

var _ Registerer = (*register)(nil)

type Registerer interface {
	Register(ctx context.Context, agentAddrBytes common.Address, portraitId *big.Int) (common.Address, error)
}

type register struct {
	client          clients.Client
	registryAddress common.Address
	registry        *contracts.AgentRegistry
	pvk             *ecdsa.PrivateKey
}

func NewRegistry(client clients.Client, registryAddress common.Address, registry *contracts.AgentRegistry, pvk *ecdsa.PrivateKey) *register {
	return &register{
		client:          client,
		registryAddress: registryAddress,
		registry:        registry,
		pvk:             pvk,
	}
}

func (r *register) Register(ctx context.Context, agentAddrBytes common.Address, portraitId *big.Int) (common.Address, error) {
	opts := callOpts(ctx)

	// Check if agent is already registered
	registered, err := r.registry.IsRegisteredAgent(opts, agentAddrBytes)
	if err != nil {
		return common.Address{}, err
	}

	// If agent is already registered, return the account address
	if registered {
		return r.registry.AgentToAccount(opts, agentAddrBytes)
	}

	// Check if agent address is account address
	isAccount, err := r.registry.IsRegisteredAccount(opts, agentAddrBytes)
	if err != nil {
		return common.Address{}, err
	}

	// Account is not allowed to register as an agent to prevent recursive registration
	if isAccount {
		return common.Address{}, ErrAccountNotAllowed
	}

	// Encode the data for the transaction for fee estimation
	enc := abi.ABI{}
	data, err := enc.Pack("register", agentAddrBytes, portraitId)
	if err != nil {
		return common.Address{}, err
	}

	// Get the signer with no send option
	auth, err := r.readyTxOpts(ctx)
	if err != nil {
		return common.Address{}, err
	}

	// Estimate the gas for the transaction
	fee, err := r.client.EstimateFee(ctx, types.CallMsg{
		CallMsg: ethereum.CallMsg{
			From: auth.From,
			To:   &r.registryAddress,
			Data: data,
		},
	})
	if err != nil {
		return common.Address{}, err
	}

	// Set the gas limit
	auth.GasLimit = fee.GasLimit.ToInt().Uint64()

	// Send the transaction
	tx, err := r.registry.Register(auth, agentAddrBytes, portraitId)
	if err != nil {
		return common.Address{}, err
	}

	// Wait for the transaction to be mined
	receipt, err := r.client.WaitMined(ctx, tx.Hash())
	if err != nil {
		return common.Address{}, err
	}

	// Check if the transaction was successful
	if receipt.Status != TxStatusSuccess {
		return common.Address{}, errors.New("transaction failed")
	}

	// Parse the event to get the account address
	event, err := r.parseAgentRegisteredEvent(receipt.Logs)
	if err != nil {
		return common.Address{}, err
	}

	// Return the account address
	return event.Account, nil
}

func (r *register) readyTxOpts(ctx context.Context) (*bind.TransactOpts, error) {
	address := crypto.PubkeyToAddress(r.pvk.PublicKey) // public key to address

	nonce, err := r.client.PendingNonceAt(ctx, address) // get the nonce
	if err != nil {
		return nil, err
	}

	gasPrice, err := r.client.SuggestGasPrice(ctx) // get the gas price
	if err != nil {
		return nil, err
	}

	chainID, err := r.client.ChainID(ctx) // get the chain ID
	if err != nil {
		return nil, err
	}

	auth, err := bind.NewKeyedTransactorWithChainID(r.pvk, chainID) // create a new transactor
	if err != nil {
		return nil, err
	}

	auth.GasPrice = gasPrice
	auth.Nonce = big.NewInt(int64(nonce))
	auth.GasLimit = 50000000

	return auth, nil
}

func (r *register) parseAgentRegisteredEvent(logs []*types.Log) (*contracts.AgentRegistryAgentRegistered, error) {
	var event *contracts.AgentRegistryAgentRegistered
	var err error

	for _, log := range logs {
		event, err = r.registry.ParseAgentRegistered(log.Log)
		if err == nil {
			return event, nil
		}
	}

	return nil, errors.New("event not found")
}

func callOpts(ctx context.Context) *bind.CallOpts {
	return &bind.CallOpts{
		Context: ctx,
	}
}

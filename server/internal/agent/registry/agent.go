// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package registry

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// AgentRegistryMetaData contains all meta data concerning the AgentRegistry contract.
var AgentRegistryMetaData = &bind.MetaData{
	ABI: "[{\"type\":\"constructor\",\"inputs\":[{\"name\":\"_factory\",\"type\":\"address\",\"internalType\":\"contractAgentAccountFactory\"},{\"name\":\"portraits\",\"type\":\"string[]\",\"internalType\":\"string[]\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"AGENT_TOKEN\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"contractAgent\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"FACTORY\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"contractAgentAccountFactory\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"accountToAgent\",\"inputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[{\"name\":\"agent\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"accountToTokenId\",\"inputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[{\"name\":\"tokenId\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"addPortrait\",\"inputs\":[{\"name\":\"_portrait\",\"type\":\"string\",\"internalType\":\"string\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"agentToAccount\",\"inputs\":[{\"name\":\"agent\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"isRegisteredAccount\",\"inputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[{\"name\":\"\",\"type\":\"bool\",\"internalType\":\"bool\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"isRegisteredAgent\",\"inputs\":[{\"name\":\"agent\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[{\"name\":\"\",\"type\":\"bool\",\"internalType\":\"bool\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"owner\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"portrait\",\"inputs\":[{\"name\":\"index\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[{\"name\":\"\",\"type\":\"string\",\"internalType\":\"string\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"portraitCount\",\"inputs\":[],\"outputs\":[{\"name\":\"\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"register\",\"inputs\":[{\"name\":\"agent\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"portraitId\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"},{\"name\":\"tokenId\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"renounceOwnership\",\"inputs\":[],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"function\",\"name\":\"supportsInterface\",\"inputs\":[{\"name\":\"interfaceId\",\"type\":\"bytes4\",\"internalType\":\"bytes4\"}],\"outputs\":[{\"name\":\"\",\"type\":\"bool\",\"internalType\":\"bool\"}],\"stateMutability\":\"pure\"},{\"type\":\"function\",\"name\":\"tokenIdToAccount\",\"inputs\":[{\"name\":\"tokenId\",\"type\":\"uint256\",\"internalType\":\"uint256\"}],\"outputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"}],\"stateMutability\":\"view\"},{\"type\":\"function\",\"name\":\"transferOwnership\",\"inputs\":[{\"name\":\"newOwner\",\"type\":\"address\",\"internalType\":\"address\"}],\"outputs\":[],\"stateMutability\":\"nonpayable\"},{\"type\":\"event\",\"name\":\"AgentRegistered\",\"inputs\":[{\"name\":\"agent\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"account\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"tokenId\",\"type\":\"uint256\",\"indexed\":true,\"internalType\":\"uint256\"}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"OwnershipTransferred\",\"inputs\":[{\"name\":\"previousOwner\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"},{\"name\":\"newOwner\",\"type\":\"address\",\"indexed\":true,\"internalType\":\"address\"}],\"anonymous\":false},{\"type\":\"event\",\"name\":\"PortraitAdded\",\"inputs\":[{\"name\":\"portraitId\",\"type\":\"uint256\",\"indexed\":true,\"internalType\":\"uint256\"},{\"name\":\"portrait\",\"type\":\"string\",\"indexed\":false,\"internalType\":\"string\"}],\"anonymous\":false},{\"type\":\"error\",\"name\":\"AgentRegistry__AccountNotAllowed\",\"inputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"}]},{\"type\":\"error\",\"name\":\"AgentRegistry__AlreadyRegistered\",\"inputs\":[{\"name\":\"agent\",\"type\":\"address\",\"internalType\":\"address\"}]},{\"type\":\"error\",\"name\":\"AgentRegistry__PortraitIndexOutOfBounds\",\"inputs\":[{\"name\":\"index\",\"type\":\"uint256\",\"internalType\":\"uint256\"}]},{\"type\":\"error\",\"name\":\"OwnableInvalidOwner\",\"inputs\":[{\"name\":\"owner\",\"type\":\"address\",\"internalType\":\"address\"}]},{\"type\":\"error\",\"name\":\"OwnableUnauthorizedAccount\",\"inputs\":[{\"name\":\"account\",\"type\":\"address\",\"internalType\":\"address\"}]}]",
}

// AgentRegistryABI is the input ABI used to generate the binding from.
// Deprecated: Use AgentRegistryMetaData.ABI instead.
var AgentRegistryABI = AgentRegistryMetaData.ABI

// AgentRegistry is an auto generated Go binding around an Ethereum contract.
type AgentRegistry struct {
	AgentRegistryCaller     // Read-only binding to the contract
	AgentRegistryTransactor // Write-only binding to the contract
	AgentRegistryFilterer   // Log filterer for contract events
}

// AgentRegistryCaller is an auto generated read-only Go binding around an Ethereum contract.
type AgentRegistryCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentRegistryTransactor is an auto generated write-only Go binding around an Ethereum contract.
type AgentRegistryTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentRegistryFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type AgentRegistryFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// AgentRegistrySession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type AgentRegistrySession struct {
	Contract     *AgentRegistry    // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// AgentRegistryCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type AgentRegistryCallerSession struct {
	Contract *AgentRegistryCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts        // Call options to use throughout this session
}

// AgentRegistryTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type AgentRegistryTransactorSession struct {
	Contract     *AgentRegistryTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts        // Transaction auth options to use throughout this session
}

// AgentRegistryRaw is an auto generated low-level Go binding around an Ethereum contract.
type AgentRegistryRaw struct {
	Contract *AgentRegistry // Generic contract binding to access the raw methods on
}

// AgentRegistryCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type AgentRegistryCallerRaw struct {
	Contract *AgentRegistryCaller // Generic read-only contract binding to access the raw methods on
}

// AgentRegistryTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type AgentRegistryTransactorRaw struct {
	Contract *AgentRegistryTransactor // Generic write-only contract binding to access the raw methods on
}

// NewAgentRegistry creates a new instance of AgentRegistry, bound to a specific deployed contract.
func NewAgentRegistry(address common.Address, backend bind.ContractBackend) (*AgentRegistry, error) {
	contract, err := bindAgentRegistry(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &AgentRegistry{AgentRegistryCaller: AgentRegistryCaller{contract: contract}, AgentRegistryTransactor: AgentRegistryTransactor{contract: contract}, AgentRegistryFilterer: AgentRegistryFilterer{contract: contract}}, nil
}

// NewAgentRegistryCaller creates a new read-only instance of AgentRegistry, bound to a specific deployed contract.
func NewAgentRegistryCaller(address common.Address, caller bind.ContractCaller) (*AgentRegistryCaller, error) {
	contract, err := bindAgentRegistry(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &AgentRegistryCaller{contract: contract}, nil
}

// NewAgentRegistryTransactor creates a new write-only instance of AgentRegistry, bound to a specific deployed contract.
func NewAgentRegistryTransactor(address common.Address, transactor bind.ContractTransactor) (*AgentRegistryTransactor, error) {
	contract, err := bindAgentRegistry(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &AgentRegistryTransactor{contract: contract}, nil
}

// NewAgentRegistryFilterer creates a new log filterer instance of AgentRegistry, bound to a specific deployed contract.
func NewAgentRegistryFilterer(address common.Address, filterer bind.ContractFilterer) (*AgentRegistryFilterer, error) {
	contract, err := bindAgentRegistry(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &AgentRegistryFilterer{contract: contract}, nil
}

// bindAgentRegistry binds a generic wrapper to an already deployed contract.
func bindAgentRegistry(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := AgentRegistryMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AgentRegistry *AgentRegistryRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AgentRegistry.Contract.AgentRegistryCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AgentRegistry *AgentRegistryRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentRegistry.Contract.AgentRegistryTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AgentRegistry *AgentRegistryRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AgentRegistry.Contract.AgentRegistryTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_AgentRegistry *AgentRegistryCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _AgentRegistry.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_AgentRegistry *AgentRegistryTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentRegistry.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_AgentRegistry *AgentRegistryTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _AgentRegistry.Contract.contract.Transact(opts, method, params...)
}

// AGENTTOKEN is a free data retrieval call binding the contract method 0xe19998a9.
//
// Solidity: function AGENT_TOKEN() view returns(address)
func (_AgentRegistry *AgentRegistryCaller) AGENTTOKEN(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "AGENT_TOKEN")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// AGENTTOKEN is a free data retrieval call binding the contract method 0xe19998a9.
//
// Solidity: function AGENT_TOKEN() view returns(address)
func (_AgentRegistry *AgentRegistrySession) AGENTTOKEN() (common.Address, error) {
	return _AgentRegistry.Contract.AGENTTOKEN(&_AgentRegistry.CallOpts)
}

// AGENTTOKEN is a free data retrieval call binding the contract method 0xe19998a9.
//
// Solidity: function AGENT_TOKEN() view returns(address)
func (_AgentRegistry *AgentRegistryCallerSession) AGENTTOKEN() (common.Address, error) {
	return _AgentRegistry.Contract.AGENTTOKEN(&_AgentRegistry.CallOpts)
}

// FACTORY is a free data retrieval call binding the contract method 0x2dd31000.
//
// Solidity: function FACTORY() view returns(address)
func (_AgentRegistry *AgentRegistryCaller) FACTORY(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "FACTORY")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// FACTORY is a free data retrieval call binding the contract method 0x2dd31000.
//
// Solidity: function FACTORY() view returns(address)
func (_AgentRegistry *AgentRegistrySession) FACTORY() (common.Address, error) {
	return _AgentRegistry.Contract.FACTORY(&_AgentRegistry.CallOpts)
}

// FACTORY is a free data retrieval call binding the contract method 0x2dd31000.
//
// Solidity: function FACTORY() view returns(address)
func (_AgentRegistry *AgentRegistryCallerSession) FACTORY() (common.Address, error) {
	return _AgentRegistry.Contract.FACTORY(&_AgentRegistry.CallOpts)
}

// AccountToAgent is a free data retrieval call binding the contract method 0xec9223c5.
//
// Solidity: function accountToAgent(address account) view returns(address agent)
func (_AgentRegistry *AgentRegistryCaller) AccountToAgent(opts *bind.CallOpts, account common.Address) (common.Address, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "accountToAgent", account)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// AccountToAgent is a free data retrieval call binding the contract method 0xec9223c5.
//
// Solidity: function accountToAgent(address account) view returns(address agent)
func (_AgentRegistry *AgentRegistrySession) AccountToAgent(account common.Address) (common.Address, error) {
	return _AgentRegistry.Contract.AccountToAgent(&_AgentRegistry.CallOpts, account)
}

// AccountToAgent is a free data retrieval call binding the contract method 0xec9223c5.
//
// Solidity: function accountToAgent(address account) view returns(address agent)
func (_AgentRegistry *AgentRegistryCallerSession) AccountToAgent(account common.Address) (common.Address, error) {
	return _AgentRegistry.Contract.AccountToAgent(&_AgentRegistry.CallOpts, account)
}

// AccountToTokenId is a free data retrieval call binding the contract method 0xde21a489.
//
// Solidity: function accountToTokenId(address account) view returns(uint256 tokenId)
func (_AgentRegistry *AgentRegistryCaller) AccountToTokenId(opts *bind.CallOpts, account common.Address) (*big.Int, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "accountToTokenId", account)

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// AccountToTokenId is a free data retrieval call binding the contract method 0xde21a489.
//
// Solidity: function accountToTokenId(address account) view returns(uint256 tokenId)
func (_AgentRegistry *AgentRegistrySession) AccountToTokenId(account common.Address) (*big.Int, error) {
	return _AgentRegistry.Contract.AccountToTokenId(&_AgentRegistry.CallOpts, account)
}

// AccountToTokenId is a free data retrieval call binding the contract method 0xde21a489.
//
// Solidity: function accountToTokenId(address account) view returns(uint256 tokenId)
func (_AgentRegistry *AgentRegistryCallerSession) AccountToTokenId(account common.Address) (*big.Int, error) {
	return _AgentRegistry.Contract.AccountToTokenId(&_AgentRegistry.CallOpts, account)
}

// AgentToAccount is a free data retrieval call binding the contract method 0x1090f368.
//
// Solidity: function agentToAccount(address agent) view returns(address account)
func (_AgentRegistry *AgentRegistryCaller) AgentToAccount(opts *bind.CallOpts, agent common.Address) (common.Address, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "agentToAccount", agent)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// AgentToAccount is a free data retrieval call binding the contract method 0x1090f368.
//
// Solidity: function agentToAccount(address agent) view returns(address account)
func (_AgentRegistry *AgentRegistrySession) AgentToAccount(agent common.Address) (common.Address, error) {
	return _AgentRegistry.Contract.AgentToAccount(&_AgentRegistry.CallOpts, agent)
}

// AgentToAccount is a free data retrieval call binding the contract method 0x1090f368.
//
// Solidity: function agentToAccount(address agent) view returns(address account)
func (_AgentRegistry *AgentRegistryCallerSession) AgentToAccount(agent common.Address) (common.Address, error) {
	return _AgentRegistry.Contract.AgentToAccount(&_AgentRegistry.CallOpts, agent)
}

// IsRegisteredAccount is a free data retrieval call binding the contract method 0xc86ae798.
//
// Solidity: function isRegisteredAccount(address account) view returns(bool)
func (_AgentRegistry *AgentRegistryCaller) IsRegisteredAccount(opts *bind.CallOpts, account common.Address) (bool, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "isRegisteredAccount", account)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsRegisteredAccount is a free data retrieval call binding the contract method 0xc86ae798.
//
// Solidity: function isRegisteredAccount(address account) view returns(bool)
func (_AgentRegistry *AgentRegistrySession) IsRegisteredAccount(account common.Address) (bool, error) {
	return _AgentRegistry.Contract.IsRegisteredAccount(&_AgentRegistry.CallOpts, account)
}

// IsRegisteredAccount is a free data retrieval call binding the contract method 0xc86ae798.
//
// Solidity: function isRegisteredAccount(address account) view returns(bool)
func (_AgentRegistry *AgentRegistryCallerSession) IsRegisteredAccount(account common.Address) (bool, error) {
	return _AgentRegistry.Contract.IsRegisteredAccount(&_AgentRegistry.CallOpts, account)
}

// IsRegisteredAgent is a free data retrieval call binding the contract method 0xe21b38d2.
//
// Solidity: function isRegisteredAgent(address agent) view returns(bool)
func (_AgentRegistry *AgentRegistryCaller) IsRegisteredAgent(opts *bind.CallOpts, agent common.Address) (bool, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "isRegisteredAgent", agent)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// IsRegisteredAgent is a free data retrieval call binding the contract method 0xe21b38d2.
//
// Solidity: function isRegisteredAgent(address agent) view returns(bool)
func (_AgentRegistry *AgentRegistrySession) IsRegisteredAgent(agent common.Address) (bool, error) {
	return _AgentRegistry.Contract.IsRegisteredAgent(&_AgentRegistry.CallOpts, agent)
}

// IsRegisteredAgent is a free data retrieval call binding the contract method 0xe21b38d2.
//
// Solidity: function isRegisteredAgent(address agent) view returns(bool)
func (_AgentRegistry *AgentRegistryCallerSession) IsRegisteredAgent(agent common.Address) (bool, error) {
	return _AgentRegistry.Contract.IsRegisteredAgent(&_AgentRegistry.CallOpts, agent)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AgentRegistry *AgentRegistryCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AgentRegistry *AgentRegistrySession) Owner() (common.Address, error) {
	return _AgentRegistry.Contract.Owner(&_AgentRegistry.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_AgentRegistry *AgentRegistryCallerSession) Owner() (common.Address, error) {
	return _AgentRegistry.Contract.Owner(&_AgentRegistry.CallOpts)
}

// Portrait is a free data retrieval call binding the contract method 0x2c792202.
//
// Solidity: function portrait(uint256 index) view returns(string)
func (_AgentRegistry *AgentRegistryCaller) Portrait(opts *bind.CallOpts, index *big.Int) (string, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "portrait", index)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// Portrait is a free data retrieval call binding the contract method 0x2c792202.
//
// Solidity: function portrait(uint256 index) view returns(string)
func (_AgentRegistry *AgentRegistrySession) Portrait(index *big.Int) (string, error) {
	return _AgentRegistry.Contract.Portrait(&_AgentRegistry.CallOpts, index)
}

// Portrait is a free data retrieval call binding the contract method 0x2c792202.
//
// Solidity: function portrait(uint256 index) view returns(string)
func (_AgentRegistry *AgentRegistryCallerSession) Portrait(index *big.Int) (string, error) {
	return _AgentRegistry.Contract.Portrait(&_AgentRegistry.CallOpts, index)
}

// PortraitCount is a free data retrieval call binding the contract method 0xbc5ea73d.
//
// Solidity: function portraitCount() view returns(uint256)
func (_AgentRegistry *AgentRegistryCaller) PortraitCount(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "portraitCount")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// PortraitCount is a free data retrieval call binding the contract method 0xbc5ea73d.
//
// Solidity: function portraitCount() view returns(uint256)
func (_AgentRegistry *AgentRegistrySession) PortraitCount() (*big.Int, error) {
	return _AgentRegistry.Contract.PortraitCount(&_AgentRegistry.CallOpts)
}

// PortraitCount is a free data retrieval call binding the contract method 0xbc5ea73d.
//
// Solidity: function portraitCount() view returns(uint256)
func (_AgentRegistry *AgentRegistryCallerSession) PortraitCount() (*big.Int, error) {
	return _AgentRegistry.Contract.PortraitCount(&_AgentRegistry.CallOpts)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) pure returns(bool)
func (_AgentRegistry *AgentRegistryCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) pure returns(bool)
func (_AgentRegistry *AgentRegistrySession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _AgentRegistry.Contract.SupportsInterface(&_AgentRegistry.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) pure returns(bool)
func (_AgentRegistry *AgentRegistryCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _AgentRegistry.Contract.SupportsInterface(&_AgentRegistry.CallOpts, interfaceId)
}

// TokenIdToAccount is a free data retrieval call binding the contract method 0xb5eff1fb.
//
// Solidity: function tokenIdToAccount(uint256 tokenId) view returns(address account)
func (_AgentRegistry *AgentRegistryCaller) TokenIdToAccount(opts *bind.CallOpts, tokenId *big.Int) (common.Address, error) {
	var out []interface{}
	err := _AgentRegistry.contract.Call(opts, &out, "tokenIdToAccount", tokenId)

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// TokenIdToAccount is a free data retrieval call binding the contract method 0xb5eff1fb.
//
// Solidity: function tokenIdToAccount(uint256 tokenId) view returns(address account)
func (_AgentRegistry *AgentRegistrySession) TokenIdToAccount(tokenId *big.Int) (common.Address, error) {
	return _AgentRegistry.Contract.TokenIdToAccount(&_AgentRegistry.CallOpts, tokenId)
}

// TokenIdToAccount is a free data retrieval call binding the contract method 0xb5eff1fb.
//
// Solidity: function tokenIdToAccount(uint256 tokenId) view returns(address account)
func (_AgentRegistry *AgentRegistryCallerSession) TokenIdToAccount(tokenId *big.Int) (common.Address, error) {
	return _AgentRegistry.Contract.TokenIdToAccount(&_AgentRegistry.CallOpts, tokenId)
}

// AddPortrait is a paid mutator transaction binding the contract method 0x395c6f49.
//
// Solidity: function addPortrait(string _portrait) returns()
func (_AgentRegistry *AgentRegistryTransactor) AddPortrait(opts *bind.TransactOpts, _portrait string) (*types.Transaction, error) {
	return _AgentRegistry.contract.Transact(opts, "addPortrait", _portrait)
}

// AddPortrait is a paid mutator transaction binding the contract method 0x395c6f49.
//
// Solidity: function addPortrait(string _portrait) returns()
func (_AgentRegistry *AgentRegistrySession) AddPortrait(_portrait string) (*types.Transaction, error) {
	return _AgentRegistry.Contract.AddPortrait(&_AgentRegistry.TransactOpts, _portrait)
}

// AddPortrait is a paid mutator transaction binding the contract method 0x395c6f49.
//
// Solidity: function addPortrait(string _portrait) returns()
func (_AgentRegistry *AgentRegistryTransactorSession) AddPortrait(_portrait string) (*types.Transaction, error) {
	return _AgentRegistry.Contract.AddPortrait(&_AgentRegistry.TransactOpts, _portrait)
}

// Register is a paid mutator transaction binding the contract method 0x6d705ebb.
//
// Solidity: function register(address agent, uint256 portraitId) returns(address account, uint256 tokenId)
func (_AgentRegistry *AgentRegistryTransactor) Register(opts *bind.TransactOpts, agent common.Address, portraitId *big.Int) (*types.Transaction, error) {
	return _AgentRegistry.contract.Transact(opts, "register", agent, portraitId)
}

// Register is a paid mutator transaction binding the contract method 0x6d705ebb.
//
// Solidity: function register(address agent, uint256 portraitId) returns(address account, uint256 tokenId)
func (_AgentRegistry *AgentRegistrySession) Register(agent common.Address, portraitId *big.Int) (*types.Transaction, error) {
	return _AgentRegistry.Contract.Register(&_AgentRegistry.TransactOpts, agent, portraitId)
}

// Register is a paid mutator transaction binding the contract method 0x6d705ebb.
//
// Solidity: function register(address agent, uint256 portraitId) returns(address account, uint256 tokenId)
func (_AgentRegistry *AgentRegistryTransactorSession) Register(agent common.Address, portraitId *big.Int) (*types.Transaction, error) {
	return _AgentRegistry.Contract.Register(&_AgentRegistry.TransactOpts, agent, portraitId)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AgentRegistry *AgentRegistryTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _AgentRegistry.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AgentRegistry *AgentRegistrySession) RenounceOwnership() (*types.Transaction, error) {
	return _AgentRegistry.Contract.RenounceOwnership(&_AgentRegistry.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_AgentRegistry *AgentRegistryTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _AgentRegistry.Contract.RenounceOwnership(&_AgentRegistry.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AgentRegistry *AgentRegistryTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _AgentRegistry.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AgentRegistry *AgentRegistrySession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AgentRegistry.Contract.TransferOwnership(&_AgentRegistry.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_AgentRegistry *AgentRegistryTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _AgentRegistry.Contract.TransferOwnership(&_AgentRegistry.TransactOpts, newOwner)
}

// AgentRegistryAgentRegisteredIterator is returned from FilterAgentRegistered and is used to iterate over the raw logs and unpacked data for AgentRegistered events raised by the AgentRegistry contract.
type AgentRegistryAgentRegisteredIterator struct {
	Event *AgentRegistryAgentRegistered // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AgentRegistryAgentRegisteredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentRegistryAgentRegistered)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AgentRegistryAgentRegistered)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AgentRegistryAgentRegisteredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentRegistryAgentRegisteredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentRegistryAgentRegistered represents a AgentRegistered event raised by the AgentRegistry contract.
type AgentRegistryAgentRegistered struct {
	Agent   common.Address
	Account common.Address
	TokenId *big.Int
	Raw     types.Log // Blockchain specific contextual infos
}

// FilterAgentRegistered is a free log retrieval operation binding the contract event 0xae6249e1b0de18c2723755a5833e4712be14aaa5c1d2b8923223ad3784964f6e.
//
// Solidity: event AgentRegistered(address indexed agent, address indexed account, uint256 indexed tokenId)
func (_AgentRegistry *AgentRegistryFilterer) FilterAgentRegistered(opts *bind.FilterOpts, agent []common.Address, account []common.Address, tokenId []*big.Int) (*AgentRegistryAgentRegisteredIterator, error) {

	var agentRule []interface{}
	for _, agentItem := range agent {
		agentRule = append(agentRule, agentItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _AgentRegistry.contract.FilterLogs(opts, "AgentRegistered", agentRule, accountRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return &AgentRegistryAgentRegisteredIterator{contract: _AgentRegistry.contract, event: "AgentRegistered", logs: logs, sub: sub}, nil
}

// WatchAgentRegistered is a free log subscription operation binding the contract event 0xae6249e1b0de18c2723755a5833e4712be14aaa5c1d2b8923223ad3784964f6e.
//
// Solidity: event AgentRegistered(address indexed agent, address indexed account, uint256 indexed tokenId)
func (_AgentRegistry *AgentRegistryFilterer) WatchAgentRegistered(opts *bind.WatchOpts, sink chan<- *AgentRegistryAgentRegistered, agent []common.Address, account []common.Address, tokenId []*big.Int) (event.Subscription, error) {

	var agentRule []interface{}
	for _, agentItem := range agent {
		agentRule = append(agentRule, agentItem)
	}
	var accountRule []interface{}
	for _, accountItem := range account {
		accountRule = append(accountRule, accountItem)
	}
	var tokenIdRule []interface{}
	for _, tokenIdItem := range tokenId {
		tokenIdRule = append(tokenIdRule, tokenIdItem)
	}

	logs, sub, err := _AgentRegistry.contract.WatchLogs(opts, "AgentRegistered", agentRule, accountRule, tokenIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentRegistryAgentRegistered)
				if err := _AgentRegistry.contract.UnpackLog(event, "AgentRegistered", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseAgentRegistered is a log parse operation binding the contract event 0xae6249e1b0de18c2723755a5833e4712be14aaa5c1d2b8923223ad3784964f6e.
//
// Solidity: event AgentRegistered(address indexed agent, address indexed account, uint256 indexed tokenId)
func (_AgentRegistry *AgentRegistryFilterer) ParseAgentRegistered(log types.Log) (*AgentRegistryAgentRegistered, error) {
	event := new(AgentRegistryAgentRegistered)
	if err := _AgentRegistry.contract.UnpackLog(event, "AgentRegistered", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AgentRegistryOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the AgentRegistry contract.
type AgentRegistryOwnershipTransferredIterator struct {
	Event *AgentRegistryOwnershipTransferred // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AgentRegistryOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentRegistryOwnershipTransferred)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AgentRegistryOwnershipTransferred)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AgentRegistryOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentRegistryOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentRegistryOwnershipTransferred represents a OwnershipTransferred event raised by the AgentRegistry contract.
type AgentRegistryOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AgentRegistry *AgentRegistryFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*AgentRegistryOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AgentRegistry.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &AgentRegistryOwnershipTransferredIterator{contract: _AgentRegistry.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AgentRegistry *AgentRegistryFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *AgentRegistryOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _AgentRegistry.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentRegistryOwnershipTransferred)
				if err := _AgentRegistry.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseOwnershipTransferred is a log parse operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_AgentRegistry *AgentRegistryFilterer) ParseOwnershipTransferred(log types.Log) (*AgentRegistryOwnershipTransferred, error) {
	event := new(AgentRegistryOwnershipTransferred)
	if err := _AgentRegistry.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// AgentRegistryPortraitAddedIterator is returned from FilterPortraitAdded and is used to iterate over the raw logs and unpacked data for PortraitAdded events raised by the AgentRegistry contract.
type AgentRegistryPortraitAddedIterator struct {
	Event *AgentRegistryPortraitAdded // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *AgentRegistryPortraitAddedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(AgentRegistryPortraitAdded)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(AgentRegistryPortraitAdded)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *AgentRegistryPortraitAddedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *AgentRegistryPortraitAddedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// AgentRegistryPortraitAdded represents a PortraitAdded event raised by the AgentRegistry contract.
type AgentRegistryPortraitAdded struct {
	PortraitId *big.Int
	Portrait   string
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterPortraitAdded is a free log retrieval operation binding the contract event 0x7cebbe26befb3496e779b6bc207d49b7295b919de51a4fff530f1a86c796297e.
//
// Solidity: event PortraitAdded(uint256 indexed portraitId, string portrait)
func (_AgentRegistry *AgentRegistryFilterer) FilterPortraitAdded(opts *bind.FilterOpts, portraitId []*big.Int) (*AgentRegistryPortraitAddedIterator, error) {

	var portraitIdRule []interface{}
	for _, portraitIdItem := range portraitId {
		portraitIdRule = append(portraitIdRule, portraitIdItem)
	}

	logs, sub, err := _AgentRegistry.contract.FilterLogs(opts, "PortraitAdded", portraitIdRule)
	if err != nil {
		return nil, err
	}
	return &AgentRegistryPortraitAddedIterator{contract: _AgentRegistry.contract, event: "PortraitAdded", logs: logs, sub: sub}, nil
}

// WatchPortraitAdded is a free log subscription operation binding the contract event 0x7cebbe26befb3496e779b6bc207d49b7295b919de51a4fff530f1a86c796297e.
//
// Solidity: event PortraitAdded(uint256 indexed portraitId, string portrait)
func (_AgentRegistry *AgentRegistryFilterer) WatchPortraitAdded(opts *bind.WatchOpts, sink chan<- *AgentRegistryPortraitAdded, portraitId []*big.Int) (event.Subscription, error) {

	var portraitIdRule []interface{}
	for _, portraitIdItem := range portraitId {
		portraitIdRule = append(portraitIdRule, portraitIdItem)
	}

	logs, sub, err := _AgentRegistry.contract.WatchLogs(opts, "PortraitAdded", portraitIdRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(AgentRegistryPortraitAdded)
				if err := _AgentRegistry.contract.UnpackLog(event, "PortraitAdded", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParsePortraitAdded is a log parse operation binding the contract event 0x7cebbe26befb3496e779b6bc207d49b7295b919de51a4fff530f1a86c796297e.
//
// Solidity: event PortraitAdded(uint256 indexed portraitId, string portrait)
func (_AgentRegistry *AgentRegistryFilterer) ParsePortraitAdded(log types.Log) (*AgentRegistryPortraitAdded, error) {
	event := new(AgentRegistryPortraitAdded)
	if err := _AgentRegistry.contract.UnpackLog(event, "PortraitAdded", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

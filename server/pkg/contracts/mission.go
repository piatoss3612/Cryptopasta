// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package contracts

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

// IMissionBoardDiscoveryReport is an auto generated low-level Go binding around an user-defined struct.
type IMissionBoardDiscoveryReport struct {
	Reporter   common.Address
	CreatedAt  *big.Int
	PriceInUSD *big.Int
	Title      string
	ContentURI string
}

// IMissionBoardRatingStats is an auto generated low-level Go binding around an user-defined struct.
type IMissionBoardRatingStats struct {
	TotalCount  *big.Int
	TotalRating *big.Int
}

// IMissionBoardSalesStats is an auto generated low-level Go binding around an user-defined struct.
type IMissionBoardSalesStats struct {
	SalesInETH    *big.Int
	SalesInUSDT   *big.Int
	ClaimedInETH  *big.Int
	ClaimedInUSDT *big.Int
}

// MissionBoardMetaData contains all meta data concerning the MissionBoard contract.
var MissionBoardMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"address\",\"name\":\"_agent\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"_usdt\",\"type\":\"address\"},{\"internalType\":\"address\",\"name\":\"converter_\",\"type\":\"address\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"rater\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"MissionBoard__AlreadyRated\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"enumIMissionBoard.PaymentMethod\",\"name\":\"paymentMethod\",\"type\":\"uint8\"}],\"name\":\"MissionBoard__InsufficientBalance\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"MissionBoard__InsufficientSalesForClaim\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"MissionBoard__InvalidETHAmount\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"MissionBoard__InvalidPaymentMethod\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"}],\"name\":\"MissionBoard__NotAgent\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"MissionBoard__NotReportOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"MissionBoard__ReportNotFound\",\"type\":\"error\"},{\"inputs\":[],\"name\":\"MissionBoard__TransferFailed\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"owner\",\"type\":\"address\"}],\"name\":\"OwnableInvalidOwner\",\"type\":\"error\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"account\",\"type\":\"address\"}],\"name\":\"OwnableUnauthorizedAccount\",\"type\":\"error\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"address\",\"name\":\"previousOwner\",\"type\":\"address\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"OwnershipTransferred\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"reporter\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint128\",\"name\":\"priceInUSD\",\"type\":\"uint128\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"contentURI\",\"type\":\"string\"}],\"name\":\"ReportDiscovery\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"rater\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"enumIMissionBoard.Rating\",\"name\":\"rating\",\"type\":\"uint8\"}],\"name\":\"ReportRated\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"buyer\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"enumIMissionBoard.PaymentMethod\",\"name\":\"paymentMethod\",\"type\":\"uint8\"}],\"name\":\"ReportTaken\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"},{\"indexed\":true,\"internalType\":\"address\",\"name\":\"caller\",\"type\":\"address\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amountInETH\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"amountInUSDT\",\"type\":\"uint256\"}],\"name\":\"SalesClaimed\",\"type\":\"event\"},{\"stateMutability\":\"payable\",\"type\":\"fallback\"},{\"inputs\":[],\"name\":\"AGENT\",\"outputs\":[{\"internalType\":\"contractIERC721\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"CP\",\"outputs\":[{\"internalType\":\"contractCryptopasta\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"PRICE_CONVERTER\",\"outputs\":[{\"internalType\":\"contractPriceConverter\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"USDT\",\"outputs\":[{\"internalType\":\"contractIERC20\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"},{\"internalType\":\"enumIMissionBoard.PaymentMethod\",\"name\":\"paymentMethod\",\"type\":\"uint8\"}],\"name\":\"buyReport\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"claimSales\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"contentURI\",\"type\":\"string\"},{\"internalType\":\"uint128\",\"name\":\"priceInUSD\",\"type\":\"uint128\"},{\"internalType\":\"enumIMissionBoard.PaymentMethod\",\"name\":\"paymentMethod\",\"type\":\"uint8\"}],\"name\":\"createReport\",\"outputs\":[],\"stateMutability\":\"payable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"getDiscoveryReport\",\"outputs\":[{\"components\":[{\"internalType\":\"address\",\"name\":\"reporter\",\"type\":\"address\"},{\"internalType\":\"uint48\",\"name\":\"createdAt\",\"type\":\"uint48\"},{\"internalType\":\"uint128\",\"name\":\"priceInUSD\",\"type\":\"uint128\"},{\"internalType\":\"string\",\"name\":\"title\",\"type\":\"string\"},{\"internalType\":\"string\",\"name\":\"contentURI\",\"type\":\"string\"}],\"internalType\":\"structIMissionBoard.DiscoveryReport\",\"name\":\"\",\"type\":\"tuple\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"getRating\",\"outputs\":[{\"components\":[{\"internalType\":\"uint128\",\"name\":\"totalCount\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"totalRating\",\"type\":\"uint128\"}],\"internalType\":\"structIMissionBoard.RatingStats\",\"name\":\"\",\"type\":\"tuple\"},{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"getSales\",\"outputs\":[{\"components\":[{\"internalType\":\"uint128\",\"name\":\"salesInETH\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"salesInUSDT\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"claimedInETH\",\"type\":\"uint128\"},{\"internalType\":\"uint128\",\"name\":\"claimedInUSDT\",\"type\":\"uint128\"}],\"internalType\":\"structIMissionBoard.SalesStats\",\"name\":\"\",\"type\":\"tuple\"},{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"rater\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"}],\"name\":\"hasRated\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"owner\",\"outputs\":[{\"internalType\":\"address\",\"name\":\"\",\"type\":\"address\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"reportId\",\"type\":\"uint256\"},{\"internalType\":\"enumIMissionBoard.Rating\",\"name\":\"rating\",\"type\":\"uint8\"}],\"name\":\"rateReport\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"ratingDecimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"renounceOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"reportingCostInETH\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"reportingCostInUSD\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"reportingCostInUSDT\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"},{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"bytes4\",\"name\":\"interfaceId\",\"type\":\"bytes4\"}],\"name\":\"supportsInterface\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"pure\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"address\",\"name\":\"newOwner\",\"type\":\"address\"}],\"name\":\"transferOwnership\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"usdPriceDecimals\",\"outputs\":[{\"internalType\":\"uint8\",\"name\":\"\",\"type\":\"uint8\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"addresspayable\",\"name\":\"to\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"amount\",\"type\":\"uint256\"},{\"internalType\":\"enumIMissionBoard.PaymentMethod\",\"name\":\"paymentMethod\",\"type\":\"uint8\"}],\"name\":\"withdraw\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// MissionBoardABI is the input ABI used to generate the binding from.
// Deprecated: Use MissionBoardMetaData.ABI instead.
var MissionBoardABI = MissionBoardMetaData.ABI

// MissionBoard is an auto generated Go binding around an Ethereum contract.
type MissionBoard struct {
	MissionBoardCaller     // Read-only binding to the contract
	MissionBoardTransactor // Write-only binding to the contract
	MissionBoardFilterer   // Log filterer for contract events
}

// MissionBoardCaller is an auto generated read-only Go binding around an Ethereum contract.
type MissionBoardCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// MissionBoardTransactor is an auto generated write-only Go binding around an Ethereum contract.
type MissionBoardTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// MissionBoardFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type MissionBoardFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// MissionBoardSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type MissionBoardSession struct {
	Contract     *MissionBoard     // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// MissionBoardCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type MissionBoardCallerSession struct {
	Contract *MissionBoardCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts       // Call options to use throughout this session
}

// MissionBoardTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type MissionBoardTransactorSession struct {
	Contract     *MissionBoardTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts       // Transaction auth options to use throughout this session
}

// MissionBoardRaw is an auto generated low-level Go binding around an Ethereum contract.
type MissionBoardRaw struct {
	Contract *MissionBoard // Generic contract binding to access the raw methods on
}

// MissionBoardCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type MissionBoardCallerRaw struct {
	Contract *MissionBoardCaller // Generic read-only contract binding to access the raw methods on
}

// MissionBoardTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type MissionBoardTransactorRaw struct {
	Contract *MissionBoardTransactor // Generic write-only contract binding to access the raw methods on
}

// NewMissionBoard creates a new instance of MissionBoard, bound to a specific deployed contract.
func NewMissionBoard(address common.Address, backend bind.ContractBackend) (*MissionBoard, error) {
	contract, err := bindMissionBoard(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &MissionBoard{MissionBoardCaller: MissionBoardCaller{contract: contract}, MissionBoardTransactor: MissionBoardTransactor{contract: contract}, MissionBoardFilterer: MissionBoardFilterer{contract: contract}}, nil
}

// NewMissionBoardCaller creates a new read-only instance of MissionBoard, bound to a specific deployed contract.
func NewMissionBoardCaller(address common.Address, caller bind.ContractCaller) (*MissionBoardCaller, error) {
	contract, err := bindMissionBoard(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &MissionBoardCaller{contract: contract}, nil
}

// NewMissionBoardTransactor creates a new write-only instance of MissionBoard, bound to a specific deployed contract.
func NewMissionBoardTransactor(address common.Address, transactor bind.ContractTransactor) (*MissionBoardTransactor, error) {
	contract, err := bindMissionBoard(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &MissionBoardTransactor{contract: contract}, nil
}

// NewMissionBoardFilterer creates a new log filterer instance of MissionBoard, bound to a specific deployed contract.
func NewMissionBoardFilterer(address common.Address, filterer bind.ContractFilterer) (*MissionBoardFilterer, error) {
	contract, err := bindMissionBoard(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &MissionBoardFilterer{contract: contract}, nil
}

// bindMissionBoard binds a generic wrapper to an already deployed contract.
func bindMissionBoard(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := MissionBoardMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_MissionBoard *MissionBoardRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _MissionBoard.Contract.MissionBoardCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_MissionBoard *MissionBoardRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _MissionBoard.Contract.MissionBoardTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_MissionBoard *MissionBoardRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _MissionBoard.Contract.MissionBoardTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_MissionBoard *MissionBoardCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _MissionBoard.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_MissionBoard *MissionBoardTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _MissionBoard.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_MissionBoard *MissionBoardTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _MissionBoard.Contract.contract.Transact(opts, method, params...)
}

// AGENT is a free data retrieval call binding the contract method 0x4f86473d.
//
// Solidity: function AGENT() view returns(address)
func (_MissionBoard *MissionBoardCaller) AGENT(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "AGENT")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// AGENT is a free data retrieval call binding the contract method 0x4f86473d.
//
// Solidity: function AGENT() view returns(address)
func (_MissionBoard *MissionBoardSession) AGENT() (common.Address, error) {
	return _MissionBoard.Contract.AGENT(&_MissionBoard.CallOpts)
}

// AGENT is a free data retrieval call binding the contract method 0x4f86473d.
//
// Solidity: function AGENT() view returns(address)
func (_MissionBoard *MissionBoardCallerSession) AGENT() (common.Address, error) {
	return _MissionBoard.Contract.AGENT(&_MissionBoard.CallOpts)
}

// CP is a free data retrieval call binding the contract method 0x6c3172a5.
//
// Solidity: function CP() view returns(address)
func (_MissionBoard *MissionBoardCaller) CP(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "CP")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// CP is a free data retrieval call binding the contract method 0x6c3172a5.
//
// Solidity: function CP() view returns(address)
func (_MissionBoard *MissionBoardSession) CP() (common.Address, error) {
	return _MissionBoard.Contract.CP(&_MissionBoard.CallOpts)
}

// CP is a free data retrieval call binding the contract method 0x6c3172a5.
//
// Solidity: function CP() view returns(address)
func (_MissionBoard *MissionBoardCallerSession) CP() (common.Address, error) {
	return _MissionBoard.Contract.CP(&_MissionBoard.CallOpts)
}

// PRICECONVERTER is a free data retrieval call binding the contract method 0x864b9b64.
//
// Solidity: function PRICE_CONVERTER() view returns(address)
func (_MissionBoard *MissionBoardCaller) PRICECONVERTER(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "PRICE_CONVERTER")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// PRICECONVERTER is a free data retrieval call binding the contract method 0x864b9b64.
//
// Solidity: function PRICE_CONVERTER() view returns(address)
func (_MissionBoard *MissionBoardSession) PRICECONVERTER() (common.Address, error) {
	return _MissionBoard.Contract.PRICECONVERTER(&_MissionBoard.CallOpts)
}

// PRICECONVERTER is a free data retrieval call binding the contract method 0x864b9b64.
//
// Solidity: function PRICE_CONVERTER() view returns(address)
func (_MissionBoard *MissionBoardCallerSession) PRICECONVERTER() (common.Address, error) {
	return _MissionBoard.Contract.PRICECONVERTER(&_MissionBoard.CallOpts)
}

// USDT is a free data retrieval call binding the contract method 0xc54e44eb.
//
// Solidity: function USDT() view returns(address)
func (_MissionBoard *MissionBoardCaller) USDT(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "USDT")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// USDT is a free data retrieval call binding the contract method 0xc54e44eb.
//
// Solidity: function USDT() view returns(address)
func (_MissionBoard *MissionBoardSession) USDT() (common.Address, error) {
	return _MissionBoard.Contract.USDT(&_MissionBoard.CallOpts)
}

// USDT is a free data retrieval call binding the contract method 0xc54e44eb.
//
// Solidity: function USDT() view returns(address)
func (_MissionBoard *MissionBoardCallerSession) USDT() (common.Address, error) {
	return _MissionBoard.Contract.USDT(&_MissionBoard.CallOpts)
}

// GetDiscoveryReport is a free data retrieval call binding the contract method 0x24dadad5.
//
// Solidity: function getDiscoveryReport(uint256 reportId) view returns((address,uint48,uint128,string,string))
func (_MissionBoard *MissionBoardCaller) GetDiscoveryReport(opts *bind.CallOpts, reportId *big.Int) (IMissionBoardDiscoveryReport, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "getDiscoveryReport", reportId)

	if err != nil {
		return *new(IMissionBoardDiscoveryReport), err
	}

	out0 := *abi.ConvertType(out[0], new(IMissionBoardDiscoveryReport)).(*IMissionBoardDiscoveryReport)

	return out0, err

}

// GetDiscoveryReport is a free data retrieval call binding the contract method 0x24dadad5.
//
// Solidity: function getDiscoveryReport(uint256 reportId) view returns((address,uint48,uint128,string,string))
func (_MissionBoard *MissionBoardSession) GetDiscoveryReport(reportId *big.Int) (IMissionBoardDiscoveryReport, error) {
	return _MissionBoard.Contract.GetDiscoveryReport(&_MissionBoard.CallOpts, reportId)
}

// GetDiscoveryReport is a free data retrieval call binding the contract method 0x24dadad5.
//
// Solidity: function getDiscoveryReport(uint256 reportId) view returns((address,uint48,uint128,string,string))
func (_MissionBoard *MissionBoardCallerSession) GetDiscoveryReport(reportId *big.Int) (IMissionBoardDiscoveryReport, error) {
	return _MissionBoard.Contract.GetDiscoveryReport(&_MissionBoard.CallOpts, reportId)
}

// GetRating is a free data retrieval call binding the contract method 0xb0ee0e9f.
//
// Solidity: function getRating(uint256 reportId) view returns((uint128,uint128), uint8)
func (_MissionBoard *MissionBoardCaller) GetRating(opts *bind.CallOpts, reportId *big.Int) (IMissionBoardRatingStats, uint8, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "getRating", reportId)

	if err != nil {
		return *new(IMissionBoardRatingStats), *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(IMissionBoardRatingStats)).(*IMissionBoardRatingStats)
	out1 := *abi.ConvertType(out[1], new(uint8)).(*uint8)

	return out0, out1, err

}

// GetRating is a free data retrieval call binding the contract method 0xb0ee0e9f.
//
// Solidity: function getRating(uint256 reportId) view returns((uint128,uint128), uint8)
func (_MissionBoard *MissionBoardSession) GetRating(reportId *big.Int) (IMissionBoardRatingStats, uint8, error) {
	return _MissionBoard.Contract.GetRating(&_MissionBoard.CallOpts, reportId)
}

// GetRating is a free data retrieval call binding the contract method 0xb0ee0e9f.
//
// Solidity: function getRating(uint256 reportId) view returns((uint128,uint128), uint8)
func (_MissionBoard *MissionBoardCallerSession) GetRating(reportId *big.Int) (IMissionBoardRatingStats, uint8, error) {
	return _MissionBoard.Contract.GetRating(&_MissionBoard.CallOpts, reportId)
}

// GetSales is a free data retrieval call binding the contract method 0x6f905b78.
//
// Solidity: function getSales(uint256 reportId) view returns((uint128,uint128,uint128,uint128), uint8)
func (_MissionBoard *MissionBoardCaller) GetSales(opts *bind.CallOpts, reportId *big.Int) (IMissionBoardSalesStats, uint8, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "getSales", reportId)

	if err != nil {
		return *new(IMissionBoardSalesStats), *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(IMissionBoardSalesStats)).(*IMissionBoardSalesStats)
	out1 := *abi.ConvertType(out[1], new(uint8)).(*uint8)

	return out0, out1, err

}

// GetSales is a free data retrieval call binding the contract method 0x6f905b78.
//
// Solidity: function getSales(uint256 reportId) view returns((uint128,uint128,uint128,uint128), uint8)
func (_MissionBoard *MissionBoardSession) GetSales(reportId *big.Int) (IMissionBoardSalesStats, uint8, error) {
	return _MissionBoard.Contract.GetSales(&_MissionBoard.CallOpts, reportId)
}

// GetSales is a free data retrieval call binding the contract method 0x6f905b78.
//
// Solidity: function getSales(uint256 reportId) view returns((uint128,uint128,uint128,uint128), uint8)
func (_MissionBoard *MissionBoardCallerSession) GetSales(reportId *big.Int) (IMissionBoardSalesStats, uint8, error) {
	return _MissionBoard.Contract.GetSales(&_MissionBoard.CallOpts, reportId)
}

// HasRated is a free data retrieval call binding the contract method 0xd25468b3.
//
// Solidity: function hasRated(address rater, uint256 reportId) view returns(bool)
func (_MissionBoard *MissionBoardCaller) HasRated(opts *bind.CallOpts, rater common.Address, reportId *big.Int) (bool, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "hasRated", rater, reportId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// HasRated is a free data retrieval call binding the contract method 0xd25468b3.
//
// Solidity: function hasRated(address rater, uint256 reportId) view returns(bool)
func (_MissionBoard *MissionBoardSession) HasRated(rater common.Address, reportId *big.Int) (bool, error) {
	return _MissionBoard.Contract.HasRated(&_MissionBoard.CallOpts, rater, reportId)
}

// HasRated is a free data retrieval call binding the contract method 0xd25468b3.
//
// Solidity: function hasRated(address rater, uint256 reportId) view returns(bool)
func (_MissionBoard *MissionBoardCallerSession) HasRated(rater common.Address, reportId *big.Int) (bool, error) {
	return _MissionBoard.Contract.HasRated(&_MissionBoard.CallOpts, rater, reportId)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_MissionBoard *MissionBoardCaller) Owner(opts *bind.CallOpts) (common.Address, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "owner")

	if err != nil {
		return *new(common.Address), err
	}

	out0 := *abi.ConvertType(out[0], new(common.Address)).(*common.Address)

	return out0, err

}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_MissionBoard *MissionBoardSession) Owner() (common.Address, error) {
	return _MissionBoard.Contract.Owner(&_MissionBoard.CallOpts)
}

// Owner is a free data retrieval call binding the contract method 0x8da5cb5b.
//
// Solidity: function owner() view returns(address)
func (_MissionBoard *MissionBoardCallerSession) Owner() (common.Address, error) {
	return _MissionBoard.Contract.Owner(&_MissionBoard.CallOpts)
}

// RatingDecimals is a free data retrieval call binding the contract method 0x36eef944.
//
// Solidity: function ratingDecimals() pure returns(uint8)
func (_MissionBoard *MissionBoardCaller) RatingDecimals(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "ratingDecimals")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// RatingDecimals is a free data retrieval call binding the contract method 0x36eef944.
//
// Solidity: function ratingDecimals() pure returns(uint8)
func (_MissionBoard *MissionBoardSession) RatingDecimals() (uint8, error) {
	return _MissionBoard.Contract.RatingDecimals(&_MissionBoard.CallOpts)
}

// RatingDecimals is a free data retrieval call binding the contract method 0x36eef944.
//
// Solidity: function ratingDecimals() pure returns(uint8)
func (_MissionBoard *MissionBoardCallerSession) RatingDecimals() (uint8, error) {
	return _MissionBoard.Contract.RatingDecimals(&_MissionBoard.CallOpts)
}

// ReportingCostInETH is a free data retrieval call binding the contract method 0xf16d12ef.
//
// Solidity: function reportingCostInETH() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardCaller) ReportingCostInETH(opts *bind.CallOpts) (*big.Int, uint8, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "reportingCostInETH")

	if err != nil {
		return *new(*big.Int), *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	out1 := *abi.ConvertType(out[1], new(uint8)).(*uint8)

	return out0, out1, err

}

// ReportingCostInETH is a free data retrieval call binding the contract method 0xf16d12ef.
//
// Solidity: function reportingCostInETH() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardSession) ReportingCostInETH() (*big.Int, uint8, error) {
	return _MissionBoard.Contract.ReportingCostInETH(&_MissionBoard.CallOpts)
}

// ReportingCostInETH is a free data retrieval call binding the contract method 0xf16d12ef.
//
// Solidity: function reportingCostInETH() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardCallerSession) ReportingCostInETH() (*big.Int, uint8, error) {
	return _MissionBoard.Contract.ReportingCostInETH(&_MissionBoard.CallOpts)
}

// ReportingCostInUSD is a free data retrieval call binding the contract method 0x239cf036.
//
// Solidity: function reportingCostInUSD() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardCaller) ReportingCostInUSD(opts *bind.CallOpts) (*big.Int, uint8, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "reportingCostInUSD")

	if err != nil {
		return *new(*big.Int), *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	out1 := *abi.ConvertType(out[1], new(uint8)).(*uint8)

	return out0, out1, err

}

// ReportingCostInUSD is a free data retrieval call binding the contract method 0x239cf036.
//
// Solidity: function reportingCostInUSD() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardSession) ReportingCostInUSD() (*big.Int, uint8, error) {
	return _MissionBoard.Contract.ReportingCostInUSD(&_MissionBoard.CallOpts)
}

// ReportingCostInUSD is a free data retrieval call binding the contract method 0x239cf036.
//
// Solidity: function reportingCostInUSD() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardCallerSession) ReportingCostInUSD() (*big.Int, uint8, error) {
	return _MissionBoard.Contract.ReportingCostInUSD(&_MissionBoard.CallOpts)
}

// ReportingCostInUSDT is a free data retrieval call binding the contract method 0x185c8d49.
//
// Solidity: function reportingCostInUSDT() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardCaller) ReportingCostInUSDT(opts *bind.CallOpts) (*big.Int, uint8, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "reportingCostInUSDT")

	if err != nil {
		return *new(*big.Int), *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)
	out1 := *abi.ConvertType(out[1], new(uint8)).(*uint8)

	return out0, out1, err

}

// ReportingCostInUSDT is a free data retrieval call binding the contract method 0x185c8d49.
//
// Solidity: function reportingCostInUSDT() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardSession) ReportingCostInUSDT() (*big.Int, uint8, error) {
	return _MissionBoard.Contract.ReportingCostInUSDT(&_MissionBoard.CallOpts)
}

// ReportingCostInUSDT is a free data retrieval call binding the contract method 0x185c8d49.
//
// Solidity: function reportingCostInUSDT() view returns(uint256, uint8)
func (_MissionBoard *MissionBoardCallerSession) ReportingCostInUSDT() (*big.Int, uint8, error) {
	return _MissionBoard.Contract.ReportingCostInUSDT(&_MissionBoard.CallOpts)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) pure returns(bool)
func (_MissionBoard *MissionBoardCaller) SupportsInterface(opts *bind.CallOpts, interfaceId [4]byte) (bool, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "supportsInterface", interfaceId)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) pure returns(bool)
func (_MissionBoard *MissionBoardSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _MissionBoard.Contract.SupportsInterface(&_MissionBoard.CallOpts, interfaceId)
}

// SupportsInterface is a free data retrieval call binding the contract method 0x01ffc9a7.
//
// Solidity: function supportsInterface(bytes4 interfaceId) pure returns(bool)
func (_MissionBoard *MissionBoardCallerSession) SupportsInterface(interfaceId [4]byte) (bool, error) {
	return _MissionBoard.Contract.SupportsInterface(&_MissionBoard.CallOpts, interfaceId)
}

// UsdPriceDecimals is a free data retrieval call binding the contract method 0xed0d294e.
//
// Solidity: function usdPriceDecimals() view returns(uint8)
func (_MissionBoard *MissionBoardCaller) UsdPriceDecimals(opts *bind.CallOpts) (uint8, error) {
	var out []interface{}
	err := _MissionBoard.contract.Call(opts, &out, "usdPriceDecimals")

	if err != nil {
		return *new(uint8), err
	}

	out0 := *abi.ConvertType(out[0], new(uint8)).(*uint8)

	return out0, err

}

// UsdPriceDecimals is a free data retrieval call binding the contract method 0xed0d294e.
//
// Solidity: function usdPriceDecimals() view returns(uint8)
func (_MissionBoard *MissionBoardSession) UsdPriceDecimals() (uint8, error) {
	return _MissionBoard.Contract.UsdPriceDecimals(&_MissionBoard.CallOpts)
}

// UsdPriceDecimals is a free data retrieval call binding the contract method 0xed0d294e.
//
// Solidity: function usdPriceDecimals() view returns(uint8)
func (_MissionBoard *MissionBoardCallerSession) UsdPriceDecimals() (uint8, error) {
	return _MissionBoard.Contract.UsdPriceDecimals(&_MissionBoard.CallOpts)
}

// BuyReport is a paid mutator transaction binding the contract method 0x8a01e1e0.
//
// Solidity: function buyReport(uint256 reportId, uint8 paymentMethod) payable returns()
func (_MissionBoard *MissionBoardTransactor) BuyReport(opts *bind.TransactOpts, reportId *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.contract.Transact(opts, "buyReport", reportId, paymentMethod)
}

// BuyReport is a paid mutator transaction binding the contract method 0x8a01e1e0.
//
// Solidity: function buyReport(uint256 reportId, uint8 paymentMethod) payable returns()
func (_MissionBoard *MissionBoardSession) BuyReport(reportId *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.BuyReport(&_MissionBoard.TransactOpts, reportId, paymentMethod)
}

// BuyReport is a paid mutator transaction binding the contract method 0x8a01e1e0.
//
// Solidity: function buyReport(uint256 reportId, uint8 paymentMethod) payable returns()
func (_MissionBoard *MissionBoardTransactorSession) BuyReport(reportId *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.BuyReport(&_MissionBoard.TransactOpts, reportId, paymentMethod)
}

// ClaimSales is a paid mutator transaction binding the contract method 0xe6235a9b.
//
// Solidity: function claimSales(uint256 reportId) returns()
func (_MissionBoard *MissionBoardTransactor) ClaimSales(opts *bind.TransactOpts, reportId *big.Int) (*types.Transaction, error) {
	return _MissionBoard.contract.Transact(opts, "claimSales", reportId)
}

// ClaimSales is a paid mutator transaction binding the contract method 0xe6235a9b.
//
// Solidity: function claimSales(uint256 reportId) returns()
func (_MissionBoard *MissionBoardSession) ClaimSales(reportId *big.Int) (*types.Transaction, error) {
	return _MissionBoard.Contract.ClaimSales(&_MissionBoard.TransactOpts, reportId)
}

// ClaimSales is a paid mutator transaction binding the contract method 0xe6235a9b.
//
// Solidity: function claimSales(uint256 reportId) returns()
func (_MissionBoard *MissionBoardTransactorSession) ClaimSales(reportId *big.Int) (*types.Transaction, error) {
	return _MissionBoard.Contract.ClaimSales(&_MissionBoard.TransactOpts, reportId)
}

// CreateReport is a paid mutator transaction binding the contract method 0xe15cfab1.
//
// Solidity: function createReport(string title, string contentURI, uint128 priceInUSD, uint8 paymentMethod) payable returns()
func (_MissionBoard *MissionBoardTransactor) CreateReport(opts *bind.TransactOpts, title string, contentURI string, priceInUSD *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.contract.Transact(opts, "createReport", title, contentURI, priceInUSD, paymentMethod)
}

// CreateReport is a paid mutator transaction binding the contract method 0xe15cfab1.
//
// Solidity: function createReport(string title, string contentURI, uint128 priceInUSD, uint8 paymentMethod) payable returns()
func (_MissionBoard *MissionBoardSession) CreateReport(title string, contentURI string, priceInUSD *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.CreateReport(&_MissionBoard.TransactOpts, title, contentURI, priceInUSD, paymentMethod)
}

// CreateReport is a paid mutator transaction binding the contract method 0xe15cfab1.
//
// Solidity: function createReport(string title, string contentURI, uint128 priceInUSD, uint8 paymentMethod) payable returns()
func (_MissionBoard *MissionBoardTransactorSession) CreateReport(title string, contentURI string, priceInUSD *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.CreateReport(&_MissionBoard.TransactOpts, title, contentURI, priceInUSD, paymentMethod)
}

// RateReport is a paid mutator transaction binding the contract method 0x67cf9ffd.
//
// Solidity: function rateReport(uint256 reportId, uint8 rating) returns()
func (_MissionBoard *MissionBoardTransactor) RateReport(opts *bind.TransactOpts, reportId *big.Int, rating uint8) (*types.Transaction, error) {
	return _MissionBoard.contract.Transact(opts, "rateReport", reportId, rating)
}

// RateReport is a paid mutator transaction binding the contract method 0x67cf9ffd.
//
// Solidity: function rateReport(uint256 reportId, uint8 rating) returns()
func (_MissionBoard *MissionBoardSession) RateReport(reportId *big.Int, rating uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.RateReport(&_MissionBoard.TransactOpts, reportId, rating)
}

// RateReport is a paid mutator transaction binding the contract method 0x67cf9ffd.
//
// Solidity: function rateReport(uint256 reportId, uint8 rating) returns()
func (_MissionBoard *MissionBoardTransactorSession) RateReport(reportId *big.Int, rating uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.RateReport(&_MissionBoard.TransactOpts, reportId, rating)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_MissionBoard *MissionBoardTransactor) RenounceOwnership(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _MissionBoard.contract.Transact(opts, "renounceOwnership")
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_MissionBoard *MissionBoardSession) RenounceOwnership() (*types.Transaction, error) {
	return _MissionBoard.Contract.RenounceOwnership(&_MissionBoard.TransactOpts)
}

// RenounceOwnership is a paid mutator transaction binding the contract method 0x715018a6.
//
// Solidity: function renounceOwnership() returns()
func (_MissionBoard *MissionBoardTransactorSession) RenounceOwnership() (*types.Transaction, error) {
	return _MissionBoard.Contract.RenounceOwnership(&_MissionBoard.TransactOpts)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_MissionBoard *MissionBoardTransactor) TransferOwnership(opts *bind.TransactOpts, newOwner common.Address) (*types.Transaction, error) {
	return _MissionBoard.contract.Transact(opts, "transferOwnership", newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_MissionBoard *MissionBoardSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _MissionBoard.Contract.TransferOwnership(&_MissionBoard.TransactOpts, newOwner)
}

// TransferOwnership is a paid mutator transaction binding the contract method 0xf2fde38b.
//
// Solidity: function transferOwnership(address newOwner) returns()
func (_MissionBoard *MissionBoardTransactorSession) TransferOwnership(newOwner common.Address) (*types.Transaction, error) {
	return _MissionBoard.Contract.TransferOwnership(&_MissionBoard.TransactOpts, newOwner)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2892a977.
//
// Solidity: function withdraw(address to, uint256 amount, uint8 paymentMethod) returns()
func (_MissionBoard *MissionBoardTransactor) Withdraw(opts *bind.TransactOpts, to common.Address, amount *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.contract.Transact(opts, "withdraw", to, amount, paymentMethod)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2892a977.
//
// Solidity: function withdraw(address to, uint256 amount, uint8 paymentMethod) returns()
func (_MissionBoard *MissionBoardSession) Withdraw(to common.Address, amount *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.Withdraw(&_MissionBoard.TransactOpts, to, amount, paymentMethod)
}

// Withdraw is a paid mutator transaction binding the contract method 0x2892a977.
//
// Solidity: function withdraw(address to, uint256 amount, uint8 paymentMethod) returns()
func (_MissionBoard *MissionBoardTransactorSession) Withdraw(to common.Address, amount *big.Int, paymentMethod uint8) (*types.Transaction, error) {
	return _MissionBoard.Contract.Withdraw(&_MissionBoard.TransactOpts, to, amount, paymentMethod)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() payable returns()
func (_MissionBoard *MissionBoardTransactor) Fallback(opts *bind.TransactOpts, calldata []byte) (*types.Transaction, error) {
	return _MissionBoard.contract.RawTransact(opts, calldata)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() payable returns()
func (_MissionBoard *MissionBoardSession) Fallback(calldata []byte) (*types.Transaction, error) {
	return _MissionBoard.Contract.Fallback(&_MissionBoard.TransactOpts, calldata)
}

// Fallback is a paid mutator transaction binding the contract fallback function.
//
// Solidity: fallback() payable returns()
func (_MissionBoard *MissionBoardTransactorSession) Fallback(calldata []byte) (*types.Transaction, error) {
	return _MissionBoard.Contract.Fallback(&_MissionBoard.TransactOpts, calldata)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_MissionBoard *MissionBoardTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _MissionBoard.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_MissionBoard *MissionBoardSession) Receive() (*types.Transaction, error) {
	return _MissionBoard.Contract.Receive(&_MissionBoard.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_MissionBoard *MissionBoardTransactorSession) Receive() (*types.Transaction, error) {
	return _MissionBoard.Contract.Receive(&_MissionBoard.TransactOpts)
}

// MissionBoardOwnershipTransferredIterator is returned from FilterOwnershipTransferred and is used to iterate over the raw logs and unpacked data for OwnershipTransferred events raised by the MissionBoard contract.
type MissionBoardOwnershipTransferredIterator struct {
	Event *MissionBoardOwnershipTransferred // Event containing the contract specifics and raw log

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
func (it *MissionBoardOwnershipTransferredIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(MissionBoardOwnershipTransferred)
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
		it.Event = new(MissionBoardOwnershipTransferred)
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
func (it *MissionBoardOwnershipTransferredIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *MissionBoardOwnershipTransferredIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// MissionBoardOwnershipTransferred represents a OwnershipTransferred event raised by the MissionBoard contract.
type MissionBoardOwnershipTransferred struct {
	PreviousOwner common.Address
	NewOwner      common.Address
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterOwnershipTransferred is a free log retrieval operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_MissionBoard *MissionBoardFilterer) FilterOwnershipTransferred(opts *bind.FilterOpts, previousOwner []common.Address, newOwner []common.Address) (*MissionBoardOwnershipTransferredIterator, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _MissionBoard.contract.FilterLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return &MissionBoardOwnershipTransferredIterator{contract: _MissionBoard.contract, event: "OwnershipTransferred", logs: logs, sub: sub}, nil
}

// WatchOwnershipTransferred is a free log subscription operation binding the contract event 0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0.
//
// Solidity: event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
func (_MissionBoard *MissionBoardFilterer) WatchOwnershipTransferred(opts *bind.WatchOpts, sink chan<- *MissionBoardOwnershipTransferred, previousOwner []common.Address, newOwner []common.Address) (event.Subscription, error) {

	var previousOwnerRule []interface{}
	for _, previousOwnerItem := range previousOwner {
		previousOwnerRule = append(previousOwnerRule, previousOwnerItem)
	}
	var newOwnerRule []interface{}
	for _, newOwnerItem := range newOwner {
		newOwnerRule = append(newOwnerRule, newOwnerItem)
	}

	logs, sub, err := _MissionBoard.contract.WatchLogs(opts, "OwnershipTransferred", previousOwnerRule, newOwnerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(MissionBoardOwnershipTransferred)
				if err := _MissionBoard.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
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
func (_MissionBoard *MissionBoardFilterer) ParseOwnershipTransferred(log types.Log) (*MissionBoardOwnershipTransferred, error) {
	event := new(MissionBoardOwnershipTransferred)
	if err := _MissionBoard.contract.UnpackLog(event, "OwnershipTransferred", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// MissionBoardReportDiscoveryIterator is returned from FilterReportDiscovery and is used to iterate over the raw logs and unpacked data for ReportDiscovery events raised by the MissionBoard contract.
type MissionBoardReportDiscoveryIterator struct {
	Event *MissionBoardReportDiscovery // Event containing the contract specifics and raw log

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
func (it *MissionBoardReportDiscoveryIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(MissionBoardReportDiscovery)
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
		it.Event = new(MissionBoardReportDiscovery)
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
func (it *MissionBoardReportDiscoveryIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *MissionBoardReportDiscoveryIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// MissionBoardReportDiscovery represents a ReportDiscovery event raised by the MissionBoard contract.
type MissionBoardReportDiscovery struct {
	ReportId   *big.Int
	Reporter   common.Address
	PriceInUSD *big.Int
	Title      string
	ContentURI string
	Raw        types.Log // Blockchain specific contextual infos
}

// FilterReportDiscovery is a free log retrieval operation binding the contract event 0x1fde578d3851e987e68a685d475f978cfa5fcdf6997592d8b5a111bb6d0dc8d7.
//
// Solidity: event ReportDiscovery(uint256 indexed reportId, address indexed reporter, uint128 priceInUSD, string title, string contentURI)
func (_MissionBoard *MissionBoardFilterer) FilterReportDiscovery(opts *bind.FilterOpts, reportId []*big.Int, reporter []common.Address) (*MissionBoardReportDiscoveryIterator, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var reporterRule []interface{}
	for _, reporterItem := range reporter {
		reporterRule = append(reporterRule, reporterItem)
	}

	logs, sub, err := _MissionBoard.contract.FilterLogs(opts, "ReportDiscovery", reportIdRule, reporterRule)
	if err != nil {
		return nil, err
	}
	return &MissionBoardReportDiscoveryIterator{contract: _MissionBoard.contract, event: "ReportDiscovery", logs: logs, sub: sub}, nil
}

// WatchReportDiscovery is a free log subscription operation binding the contract event 0x1fde578d3851e987e68a685d475f978cfa5fcdf6997592d8b5a111bb6d0dc8d7.
//
// Solidity: event ReportDiscovery(uint256 indexed reportId, address indexed reporter, uint128 priceInUSD, string title, string contentURI)
func (_MissionBoard *MissionBoardFilterer) WatchReportDiscovery(opts *bind.WatchOpts, sink chan<- *MissionBoardReportDiscovery, reportId []*big.Int, reporter []common.Address) (event.Subscription, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var reporterRule []interface{}
	for _, reporterItem := range reporter {
		reporterRule = append(reporterRule, reporterItem)
	}

	logs, sub, err := _MissionBoard.contract.WatchLogs(opts, "ReportDiscovery", reportIdRule, reporterRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(MissionBoardReportDiscovery)
				if err := _MissionBoard.contract.UnpackLog(event, "ReportDiscovery", log); err != nil {
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

// ParseReportDiscovery is a log parse operation binding the contract event 0x1fde578d3851e987e68a685d475f978cfa5fcdf6997592d8b5a111bb6d0dc8d7.
//
// Solidity: event ReportDiscovery(uint256 indexed reportId, address indexed reporter, uint128 priceInUSD, string title, string contentURI)
func (_MissionBoard *MissionBoardFilterer) ParseReportDiscovery(log types.Log) (*MissionBoardReportDiscovery, error) {
	event := new(MissionBoardReportDiscovery)
	if err := _MissionBoard.contract.UnpackLog(event, "ReportDiscovery", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// MissionBoardReportRatedIterator is returned from FilterReportRated and is used to iterate over the raw logs and unpacked data for ReportRated events raised by the MissionBoard contract.
type MissionBoardReportRatedIterator struct {
	Event *MissionBoardReportRated // Event containing the contract specifics and raw log

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
func (it *MissionBoardReportRatedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(MissionBoardReportRated)
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
		it.Event = new(MissionBoardReportRated)
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
func (it *MissionBoardReportRatedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *MissionBoardReportRatedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// MissionBoardReportRated represents a ReportRated event raised by the MissionBoard contract.
type MissionBoardReportRated struct {
	ReportId *big.Int
	Rater    common.Address
	Rating   uint8
	Raw      types.Log // Blockchain specific contextual infos
}

// FilterReportRated is a free log retrieval operation binding the contract event 0x735d48eb9439e278c0e8a62896ce5999ae46ec2d66af637d2f919b00dabd3f06.
//
// Solidity: event ReportRated(uint256 indexed reportId, address indexed rater, uint8 rating)
func (_MissionBoard *MissionBoardFilterer) FilterReportRated(opts *bind.FilterOpts, reportId []*big.Int, rater []common.Address) (*MissionBoardReportRatedIterator, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var raterRule []interface{}
	for _, raterItem := range rater {
		raterRule = append(raterRule, raterItem)
	}

	logs, sub, err := _MissionBoard.contract.FilterLogs(opts, "ReportRated", reportIdRule, raterRule)
	if err != nil {
		return nil, err
	}
	return &MissionBoardReportRatedIterator{contract: _MissionBoard.contract, event: "ReportRated", logs: logs, sub: sub}, nil
}

// WatchReportRated is a free log subscription operation binding the contract event 0x735d48eb9439e278c0e8a62896ce5999ae46ec2d66af637d2f919b00dabd3f06.
//
// Solidity: event ReportRated(uint256 indexed reportId, address indexed rater, uint8 rating)
func (_MissionBoard *MissionBoardFilterer) WatchReportRated(opts *bind.WatchOpts, sink chan<- *MissionBoardReportRated, reportId []*big.Int, rater []common.Address) (event.Subscription, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var raterRule []interface{}
	for _, raterItem := range rater {
		raterRule = append(raterRule, raterItem)
	}

	logs, sub, err := _MissionBoard.contract.WatchLogs(opts, "ReportRated", reportIdRule, raterRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(MissionBoardReportRated)
				if err := _MissionBoard.contract.UnpackLog(event, "ReportRated", log); err != nil {
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

// ParseReportRated is a log parse operation binding the contract event 0x735d48eb9439e278c0e8a62896ce5999ae46ec2d66af637d2f919b00dabd3f06.
//
// Solidity: event ReportRated(uint256 indexed reportId, address indexed rater, uint8 rating)
func (_MissionBoard *MissionBoardFilterer) ParseReportRated(log types.Log) (*MissionBoardReportRated, error) {
	event := new(MissionBoardReportRated)
	if err := _MissionBoard.contract.UnpackLog(event, "ReportRated", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// MissionBoardReportTakenIterator is returned from FilterReportTaken and is used to iterate over the raw logs and unpacked data for ReportTaken events raised by the MissionBoard contract.
type MissionBoardReportTakenIterator struct {
	Event *MissionBoardReportTaken // Event containing the contract specifics and raw log

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
func (it *MissionBoardReportTakenIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(MissionBoardReportTaken)
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
		it.Event = new(MissionBoardReportTaken)
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
func (it *MissionBoardReportTakenIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *MissionBoardReportTakenIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// MissionBoardReportTaken represents a ReportTaken event raised by the MissionBoard contract.
type MissionBoardReportTaken struct {
	ReportId      *big.Int
	Buyer         common.Address
	PaymentMethod uint8
	Raw           types.Log // Blockchain specific contextual infos
}

// FilterReportTaken is a free log retrieval operation binding the contract event 0x0497893253973be72c125dfd0a71365a406c267f738766c8602ed0f998e6edea.
//
// Solidity: event ReportTaken(uint256 indexed reportId, address indexed buyer, uint8 paymentMethod)
func (_MissionBoard *MissionBoardFilterer) FilterReportTaken(opts *bind.FilterOpts, reportId []*big.Int, buyer []common.Address) (*MissionBoardReportTakenIterator, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var buyerRule []interface{}
	for _, buyerItem := range buyer {
		buyerRule = append(buyerRule, buyerItem)
	}

	logs, sub, err := _MissionBoard.contract.FilterLogs(opts, "ReportTaken", reportIdRule, buyerRule)
	if err != nil {
		return nil, err
	}
	return &MissionBoardReportTakenIterator{contract: _MissionBoard.contract, event: "ReportTaken", logs: logs, sub: sub}, nil
}

// WatchReportTaken is a free log subscription operation binding the contract event 0x0497893253973be72c125dfd0a71365a406c267f738766c8602ed0f998e6edea.
//
// Solidity: event ReportTaken(uint256 indexed reportId, address indexed buyer, uint8 paymentMethod)
func (_MissionBoard *MissionBoardFilterer) WatchReportTaken(opts *bind.WatchOpts, sink chan<- *MissionBoardReportTaken, reportId []*big.Int, buyer []common.Address) (event.Subscription, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var buyerRule []interface{}
	for _, buyerItem := range buyer {
		buyerRule = append(buyerRule, buyerItem)
	}

	logs, sub, err := _MissionBoard.contract.WatchLogs(opts, "ReportTaken", reportIdRule, buyerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(MissionBoardReportTaken)
				if err := _MissionBoard.contract.UnpackLog(event, "ReportTaken", log); err != nil {
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

// ParseReportTaken is a log parse operation binding the contract event 0x0497893253973be72c125dfd0a71365a406c267f738766c8602ed0f998e6edea.
//
// Solidity: event ReportTaken(uint256 indexed reportId, address indexed buyer, uint8 paymentMethod)
func (_MissionBoard *MissionBoardFilterer) ParseReportTaken(log types.Log) (*MissionBoardReportTaken, error) {
	event := new(MissionBoardReportTaken)
	if err := _MissionBoard.contract.UnpackLog(event, "ReportTaken", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// MissionBoardSalesClaimedIterator is returned from FilterSalesClaimed and is used to iterate over the raw logs and unpacked data for SalesClaimed events raised by the MissionBoard contract.
type MissionBoardSalesClaimedIterator struct {
	Event *MissionBoardSalesClaimed // Event containing the contract specifics and raw log

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
func (it *MissionBoardSalesClaimedIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(MissionBoardSalesClaimed)
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
		it.Event = new(MissionBoardSalesClaimed)
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
func (it *MissionBoardSalesClaimedIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *MissionBoardSalesClaimedIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// MissionBoardSalesClaimed represents a SalesClaimed event raised by the MissionBoard contract.
type MissionBoardSalesClaimed struct {
	ReportId     *big.Int
	Caller       common.Address
	AmountInETH  *big.Int
	AmountInUSDT *big.Int
	Raw          types.Log // Blockchain specific contextual infos
}

// FilterSalesClaimed is a free log retrieval operation binding the contract event 0xd40614f3f688e144ccfd6f74eafb8d44f69e23c1724603374fb31132221abdf1.
//
// Solidity: event SalesClaimed(uint256 indexed reportId, address indexed caller, uint256 amountInETH, uint256 amountInUSDT)
func (_MissionBoard *MissionBoardFilterer) FilterSalesClaimed(opts *bind.FilterOpts, reportId []*big.Int, caller []common.Address) (*MissionBoardSalesClaimedIterator, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}

	logs, sub, err := _MissionBoard.contract.FilterLogs(opts, "SalesClaimed", reportIdRule, callerRule)
	if err != nil {
		return nil, err
	}
	return &MissionBoardSalesClaimedIterator{contract: _MissionBoard.contract, event: "SalesClaimed", logs: logs, sub: sub}, nil
}

// WatchSalesClaimed is a free log subscription operation binding the contract event 0xd40614f3f688e144ccfd6f74eafb8d44f69e23c1724603374fb31132221abdf1.
//
// Solidity: event SalesClaimed(uint256 indexed reportId, address indexed caller, uint256 amountInETH, uint256 amountInUSDT)
func (_MissionBoard *MissionBoardFilterer) WatchSalesClaimed(opts *bind.WatchOpts, sink chan<- *MissionBoardSalesClaimed, reportId []*big.Int, caller []common.Address) (event.Subscription, error) {

	var reportIdRule []interface{}
	for _, reportIdItem := range reportId {
		reportIdRule = append(reportIdRule, reportIdItem)
	}
	var callerRule []interface{}
	for _, callerItem := range caller {
		callerRule = append(callerRule, callerItem)
	}

	logs, sub, err := _MissionBoard.contract.WatchLogs(opts, "SalesClaimed", reportIdRule, callerRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(MissionBoardSalesClaimed)
				if err := _MissionBoard.contract.UnpackLog(event, "SalesClaimed", log); err != nil {
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

// ParseSalesClaimed is a log parse operation binding the contract event 0xd40614f3f688e144ccfd6f74eafb8d44f69e23c1724603374fb31132221abdf1.
//
// Solidity: event SalesClaimed(uint256 indexed reportId, address indexed caller, uint256 amountInETH, uint256 amountInUSDT)
func (_MissionBoard *MissionBoardFilterer) ParseSalesClaimed(log types.Log) (*MissionBoardSalesClaimed, error) {
	event := new(MissionBoardSalesClaimed)
	if err := _MissionBoard.contract.UnpackLog(event, "SalesClaimed", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

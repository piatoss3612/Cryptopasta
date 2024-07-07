// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {PriceConverter} from "../chainlink/PriceConverter.sol";

import "@matterlabs/zksync-contracts/l2/system-contracts/Constants.sol";

import {
    IPaymaster,
    ExecutionResult,
    PAYMASTER_VALIDATION_SUCCESS_MAGIC
} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymaster.sol";
import {IPaymasterFlow} from "@matterlabs/zksync-contracts/l2/system-contracts/interfaces/IPaymasterFlow.sol";
import {
    TransactionHelper,
    Transaction
} from "@matterlabs/zksync-contracts/l2/system-contracts/libraries/TransactionHelper.sol";

/// @author Matter Labs
/// @notice This smart contract pays the gas fees on behalf of users that are the owner of a specific NFT asset
contract AgentPaymaster is IPaymaster, Ownable {
    error AgentPaymaster__InvalidPaymasterFlow();
    error AgentPaymaster__UserDoesNotHoldNFTAsset();
    error AgentPaymaster__TransactionLimitReached();
    error AgentPaymaster__FundsTransferFailed();
    error AgentPaymaster__UnsupportedToken();

    uint256 public constant TOKEN_PAYMENT_SPONSOR_RATE = 500; // 5%
    uint256 public constant MIN_EXCEPTION_ON_REFUND = 0.005 * 10 ** 6; // 0.005 USDT

    IERC721 private immutable nft_asset;
    PriceConverter private immutable priceConverter;
    address private immutable usdt;

    uint256 public maxTransactionsPerDay = 10;

    mapping(address => uint256) public dailyTransactionCount;
    mapping(address => uint256) public lastTransactionTimestamp;

    event TransactionLimitChanged(uint256 newLimit);
    event Approved(address indexed user, uint256 requiredUsdtAmount, uint256 sponsored);
    event Refund(address indexed user, uint256 requiredUsdtAmount, uint256 usedUsdtAmount, uint256 usdtRefund);

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continue execution if called from the bootloader.
        _;
    }

    // The constructor takes the address of the ERC721 contract as an argument.
    // The ERC721 contract is the asset that the user must hold in order to use the paymaster.
    constructor(address _erc721, address _priceConverter, address _usdt) Ownable(msg.sender) {
        nft_asset = IERC721(_erc721); // Initialize the ERC721 contract
        priceConverter = PriceConverter(_priceConverter);
        usdt = _usdt;
    }

    function setMaxTransactionsPerDay(uint256 _maxTransactionsPerDay) external onlyOwner {
        maxTransactionsPerDay = _maxTransactionsPerDay;
        emit TransactionLimitChanged(_maxTransactionsPerDay);
    }

    // The gas fees will be paid for by the paymaster if the user is the owner of the required NFT asset.
    function validateAndPayForPaymasterTransaction(bytes32, bytes32, Transaction calldata _transaction)
        external
        payable
        onlyBootloader
        returns (bytes4 magic, bytes memory context)
    {
        magic = PAYMASTER_VALIDATION_SUCCESS_MAGIC;
        if (_transaction.paymasterInput.length < 4) {
            revert AgentPaymaster__InvalidPaymasterFlow();
        }

        bytes4 paymasterInputSelector = bytes4(_transaction.paymasterInput[0:4]);

        address userAddress = address(uint160(_transaction.from));

        // Validate that the user is the owner of the required NFT asset
        _validateNFTHolding(userAddress);

        uint256 requiredETH = _transaction.gasLimit * _transaction.maxFeePerGas;

        if (paymasterInputSelector == IPaymasterFlow.general.selector) {
            // Validate the daily transaction limit
            _validateTransactionLimit(userAddress);
            // Pay the fee for the user
            _payFee(requiredETH);
        } else if (paymasterInputSelector == IPaymasterFlow.approvalBased.selector) {
            // Check if the token is USDT
            (address token,,) = abi.decode(_transaction.paymasterInput[4:], (address, uint256, bytes));
            if (token != usdt) {
                revert AgentPaymaster__UnsupportedToken();
            }
            // Start the approval-based paymaster flow
            context = _approvalBasedPaymasterFlow(userAddress, requiredETH);
            // Pay the fee for the user
            _payFee(requiredETH);
        } else {
            revert AgentPaymaster__InvalidPaymasterFlow();
        }
    }

    function _validateNFTHolding(address _user) internal {
        if (nft_asset.balanceOf(_user) == 0) {
            revert AgentPaymaster__UserDoesNotHoldNFTAsset();
        }
    }

    function _payFee(uint256 _requiredETH) internal {
        (bool success,) = payable(BOOTLOADER_FORMAL_ADDRESS).call{value: _requiredETH}("");
        if (!success) {
            revert AgentPaymaster__FundsTransferFailed();
        }
    }

    function _approvalBasedPaymasterFlow(address _user, uint256 _requiredETH) internal returns (bytes memory context) {
        uint256 requiredUsdtAmount = priceConverter.convertNativeAssetToUSDT(_requiredETH);
        uint256 sponsored;

        if (requiredUsdtAmount > 0) {
            sponsored = requiredUsdtAmount * TOKEN_PAYMENT_SPONSOR_RATE / 10000; // 5% of the fee
            requiredUsdtAmount -= sponsored;
        }

        uint256 balance = IERC20(usdt).balanceOf(address(this));
        IERC20(usdt).transferFrom(_user, address(this), requiredUsdtAmount);
        if (IERC20(usdt).balanceOf(address(this)) - balance < requiredUsdtAmount) {
            revert AgentPaymaster__FundsTransferFailed();
        }

        context = abi.encode(requiredUsdtAmount, sponsored);

        emit Approved(_user, requiredUsdtAmount, sponsored);
    }

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable override onlyBootloader {
        // _context is the return value of the validateAndPayForPaymasterTransaction function
        if (_context.length == 0) {
            return;
        }

        (uint256 requiredUsdtAmount, uint256 sponsored) = abi.decode(_context, (uint256, uint256));

        // Calculate the amount of USDT to refund to the user
        uint256 usedGas = _transaction.gasLimit - _maxRefundedGas;
        uint256 usedUsdtAmount = priceConverter.convertNativeAssetToUSDT(usedGas);
        usedUsdtAmount -= usedUsdtAmount * TOKEN_PAYMENT_SPONSOR_RATE / 10000;

        if (usedUsdtAmount == 0) {
            usedUsdtAmount = MIN_EXCEPTION_ON_REFUND;
        }

        uint256 usdtRefund;

        if (requiredUsdtAmount > usedUsdtAmount) {
            usdtRefund = requiredUsdtAmount - usedUsdtAmount;
        }

        address userAddress = address(uint160(_transaction.from));

        if (usdtRefund > 0) {
            IERC20(usdt).transfer(userAddress, usdtRefund);
        }

        emit Refund(userAddress, requiredUsdtAmount, usedUsdtAmount, usdtRefund);
    }

    function withdraw(address payable _to) external onlyOwner {
        // send paymaster funds to the owner
        uint256 balance = address(this).balance;
        (bool success,) = _to.call{value: balance}("");
        require(success, "Failed to withdraw funds from paymaster.");
    }

    function withdrawToken(address _token, address _to) external onlyOwner {
        IERC20 token = IERC20(_token);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(_to, balance);
    }

    function _validateTransactionLimit(address _user) internal {
        uint256 currentTimestamp = block.timestamp;
        uint256 today6AM = (currentTimestamp / 86400) * 86400 + 21600;

        // Reset daily transaction count if the last transaction was made before 6AM (utc) today
        // and the current transaction is made after 6AM today.
        if (lastTransactionTimestamp[_user] < today6AM && currentTimestamp >= today6AM) {
            dailyTransactionCount[_user] = 0;
        }

        if (dailyTransactionCount[_user] >= maxTransactionsPerDay) {
            revert AgentPaymaster__TransactionLimitReached();
        }

        dailyTransactionCount[_user]++;
        lastTransactionTimestamp[_user] = currentTimestamp;
    }

    receive() external payable {}
}

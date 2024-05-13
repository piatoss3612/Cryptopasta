// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

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

    uint256 public maxTransactionsPerDay = 5;

    IERC721 private immutable nft_asset;

    mapping(address => uint256) public dailyTransactionCount;
    mapping(address => uint256) public lastTransactionTimestamp;

    modifier onlyBootloader() {
        require(msg.sender == BOOTLOADER_FORMAL_ADDRESS, "Only bootloader can call this method");
        // Continue execution if called from the bootloader.
        _;
    }

    // The constructor takes the address of the ERC721 contract as an argument.
    // The ERC721 contract is the asset that the user must hold in order to use the paymaster.
    constructor(address _erc721) Ownable(msg.sender) {
        nft_asset = IERC721(_erc721); // Initialize the ERC721 contract
    }

    function setMaxTransactionsPerDay(uint256 _maxTransactionsPerDay) external onlyOwner {
        maxTransactionsPerDay = _maxTransactionsPerDay;
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

        if (paymasterInputSelector == IPaymasterFlow.general.selector) {
            address userAddress = address(uint160(_transaction.from));

            if (nft_asset.balanceOf(userAddress) == 0) {
                revert AgentPaymaster__UserDoesNotHoldNFTAsset();
            }

            _validateTransactionLimit(userAddress);

            uint256 requiredETH = _transaction.gasLimit * _transaction.maxFeePerGas;

            (bool success,) = payable(BOOTLOADER_FORMAL_ADDRESS).call{value: requiredETH}("");
            if (!success) {
                revert AgentPaymaster__FundsTransferFailed();
            }
        } else {
            revert AgentPaymaster__InvalidPaymasterFlow();
        }
    }

    function postTransaction(
        bytes calldata _context,
        Transaction calldata _transaction,
        bytes32,
        bytes32,
        ExecutionResult _txResult,
        uint256 _maxRefundedGas
    ) external payable override onlyBootloader {}

    function withdraw(address payable _to) external onlyOwner {
        // send paymaster funds to the owner
        uint256 balance = address(this).balance;
        (bool success,) = _to.call{value: balance}("");
        require(success, "Failed to withdraw funds from paymaster.");
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

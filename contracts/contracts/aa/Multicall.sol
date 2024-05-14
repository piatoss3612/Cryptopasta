// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

abstract contract Multicall {
    error FailedCall(bytes data);

    bytes4 public constant MULTICALL_SELECTOR = 0x28181829; // bytes4(keccak256("multicall(address[],bytes[],uint256[])"))

    function _isMulticall(address to, bytes calldata data) internal view returns (bool check) {
        if (data.length < 4) {
            return false;
        }

        bytes4 selector = bytes4(data[0:4]);

        check = selector == MULTICALL_SELECTOR && to == address(this);
    }

    function _multicall(address[] memory targets, bytes[] memory calldatas, uint256[] memory values) internal {
        // no need to check for length of arrays
        for (uint256 i = 0; i < targets.length;) {
            _execute(targets[i], calldatas[i], values[i]);
            unchecked {
                i += 1;
            }
        }
    }

    function _execute(address to, bytes memory data, uint256 value) internal {
        // Address.functionCallWithValue(to, data, value);
        (bool success, bytes memory returnData) = to.call{value: value}(data);
        if (!success) {
            revert FailedCall(returnData);
        }
    }

    function _decodeMulticallData(bytes calldata data)
        internal
        pure
        returns (address[] memory targets, bytes[] memory calldatas, uint256[] memory values)
    {
        (, targets, calldatas, values) = abi.decode(data, (bytes4, address[], bytes[], uint256[]));
    }
}

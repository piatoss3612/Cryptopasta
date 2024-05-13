// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

abstract contract Multicall {
    bytes4 public constant MULTICALL_SELECTOR = 0x28181829; // bytes4(keccak256("multicall(address[],bytes[],uint256[])"))

    function _isMulticall(address to, bytes memory data) internal view returns (bool check) {
        if (data.length < 4) {
            return false;
        }

        bytes4 selector = bytes4(data[0]) | bytes4(data[1]) >> 8 | bytes4(data[2]) >> 16 | bytes4(data[3]) >> 24;

        check = selector == MULTICALL_SELECTOR && to == address(this);
    }

    function _multicall(address[] memory targets, bytes[] memory calldatas, uint256[] memory values) internal {
        // no need to check for length of arrays
        for (uint256 i = 0; i < targets.length;) {
            Address.functionCallWithValue(targets[i], calldatas[i], values[i]);
            unchecked {
                i += 1;
            }
        }
    }

    function _decodeMulticallData(bytes memory data)
        internal
        pure
        returns (address[] memory targets, bytes[] memory calldatas, uint256[] memory values)
    {
        (, targets, calldatas, values) = abi.decode(data, (bytes4, address[], bytes[], uint256[]));
    }
}

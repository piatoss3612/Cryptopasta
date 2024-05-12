// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Address} from "@openzeppelin/contracts/utils/Address.sol";

abstract contract Multicall {
    function isMulticall(address to, bytes memory data) public view returns (bool check) {
        if (data.length < 4) {
            return false;
        }

        bytes4 selector = bytes4(data[0]) | bytes4(data[1]) >> 8 | bytes4(data[2]) >> 16 | bytes4(data[3]) >> 24;

        check = selector == this.multicall.selector && to == address(this);
    }

    function multicall(address[] memory targets, bytes[] memory calldatas, uint256[] memory values) public virtual {
        // no need to check for length of arrays
        for (uint256 i = 0; i < targets.length;) {
            Address.functionCallWithValue(targets[i], calldatas[i], values[i]);

            unchecked {
                i += 1;
            }
        }
    }

    function _decodeMulticall(bytes memory data)
        internal
        pure
        returns (address[] memory targets, bytes[] memory calldatas, uint256[] memory values)
    {
        (, targets, calldatas, values) = abi.decode(data, (bytes4, address[], bytes[], uint256[]));
    }
}

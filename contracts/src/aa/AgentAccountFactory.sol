// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentAccount} from "./AgentAccount.sol";

contract AgentAccountFactory {
    bytes32 public aaBytecodeHash;

    constructor() {}

    function deployAccount(address owner) external returns (address accountAddress) {
        accountAddress = address(new AgentAccount(owner));
    }
}

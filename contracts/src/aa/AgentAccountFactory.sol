// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentAccount} from "./AgentAccount.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AgentAccountFactory is Ownable {
    bytes32 public aaBytecodeHash;

    constructor() Ownable(msg.sender) {}

    function deployAccount(bytes32 salt, address owner) external returns (address accountAddress) {
        accountAddress = address(new AgentAccount{salt: salt}(owner));
    }
}

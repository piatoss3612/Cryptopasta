// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentRegistry} from "src/core/AgentRegistry.sol";
import {AgentAccountFactory} from "src/aa/AgentAccountFactory.sol";
import {Script, console} from "forge-std/Script.sol";

contract AgentRegistryScript is Script {
    function run() public {
        vm.startBroadcast();

        AgentAccountFactory aaFactory = new AgentAccountFactory();
        AgentRegistry agentRegistry = new AgentRegistry(aaFactory, new string[](0));

        (address account, uint256 tokenId) = agentRegistry.register(msg.sender, 0);

        vm.stopBroadcast();

        console.log("AgentRegistry created at address: ", address(agentRegistry));
        console.log("AgentAccountFactory created at address: ", address(aaFactory));
        console.log("Agent Token: ", address(agentRegistry.AGENT_TOKEN()));
        console.log("Agent Account: ", account);
        console.log("Token ID: ", tokenId);
    }
}

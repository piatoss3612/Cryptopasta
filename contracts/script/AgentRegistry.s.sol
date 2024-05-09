// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentRegistry} from "src/core/AgentRegistry.sol";
import {AgentAccountFactory} from "src/aa/AgentAccountFactory.sol";
import {Script, console} from "forge-std/Script.sol";

contract AgentRegistryScript is Script {
    function run() public {
        string[] memory portraits = new string[](4);
        portraits[0] =
            "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmfPN898BsCRsinpvNZkw1uQyw9HjApWZKKrMyZq9RXUqu";
        portraits[1] =
            "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmVoH7ptD5K78dsBa9hqnEhGU91epgnhdqxWZdZgaJd485";
        portraits[2] =
            "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmaXymEBvAqpbVo7uX682arywHFjiw4yuH8A98hw8crG7Z";
        portraits[3] =
            "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmXTxdydZDs62hC3HUSq1y3JboqcFMnVVQgm9Td28U3U96";

        vm.startBroadcast();

        AgentAccountFactory aaFactory = AgentAccountFactory(0xff964183D5FEAfE1F194939aB00d423348277f6d);
        AgentRegistry agentRegistry = new AgentRegistry(aaFactory, portraits);

        vm.stopBroadcast();

        console.log("AgentRegistry created at address: ", address(agentRegistry));
        console.log("AgentAccountFactory created at address: ", address(aaFactory));
        console.log("Agent Token: ", address(agentRegistry.AGENT_TOKEN()));
    }
}

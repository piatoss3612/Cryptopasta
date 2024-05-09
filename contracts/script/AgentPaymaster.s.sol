// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentPaymaster} from "src/aa/AgentPaymaster.sol";
import {Script, console} from "forge-std/Script.sol";

contract AgentRegistryScript is Script {
    function run() public {
        vm.startBroadcast();

        AgentPaymaster paymaster = new AgentPaymaster(0xfaE076ACc8bc7FC70a8C9137FB1Bf07983D62A9A);

        vm.stopBroadcast();

        console.log("AgentPaymaster: ", address(paymaster));
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentPaymaster} from "src/aa/AgentPaymaster.sol";
import {Script, console} from "forge-std/Script.sol";

contract AgentRegistryScript is Script {
    function run() public {
        vm.startBroadcast();

        AgentPaymaster paymaster = new AgentPaymaster(0x65dcD3047bA46e2926CC4C077A8F8477B91F333b);

        vm.stopBroadcast();

        console.log("AgentPaymaster: ", address(paymaster));
    }
}

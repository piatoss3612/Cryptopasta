// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentPaymaster} from "src/aa/AgentPaymaster.sol";
import {Script, console} from "forge-std/Script.sol";

contract AgentRegistryScript is Script {
    function run() public {
        vm.startBroadcast();

        AgentPaymaster paymaster = new AgentPaymaster(0xD120fE2C504Cb1e3600e9768bAcd96F8520C661D);

        vm.stopBroadcast();

        console.log("AgentPaymaster: ", address(paymaster));
    }
}

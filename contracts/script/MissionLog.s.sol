// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MissionLog} from "src/token/MissionLog.sol";
import {Script, console} from "forge-std/Script.sol";

contract MissionLogScript is Script {
    function run() public {
        vm.startBroadcast();

        MissionLog log = new MissionLog(0x65dcD3047bA46e2926CC4C077A8F8477B91F333b);

        vm.stopBroadcast();

        console.log("MissionLog: ", address(log));
    }
}

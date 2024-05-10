// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MissionLog} from "src/token/MissionLog.sol";
import {Script, console} from "forge-std/Script.sol";

contract MissionLogScript is Script {
    function run() public {
        vm.startBroadcast();

        MissionLog log = new MissionLog(0xC16A43E63fa3D48797025dE4d3e838A9fb9C358c);

        vm.stopBroadcast();

        console.log("MissionLog: ", address(log));
    }
}

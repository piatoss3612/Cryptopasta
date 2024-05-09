// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MissionLog} from "src/token/MissionLog.sol";
import {Script, console} from "forge-std/Script.sol";

contract MissionLogScript is Script {
    function run() public {
        vm.startBroadcast();

        MissionLog log = new MissionLog(0xfaE076ACc8bc7FC70a8C9137FB1Bf07983D62A9A);

        vm.stopBroadcast();

        console.log("MissionLog: ", address(log));
    }
}

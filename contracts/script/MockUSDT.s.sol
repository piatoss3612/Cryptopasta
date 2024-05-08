// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MockUSDT} from "src/mock/MockUSDT.sol";
import {Script, console} from "forge-std/Script.sol";

contract MockUSDTScript is Script {
    function run() public {
        vm.startBroadcast();

        MockUSDT usdt = new MockUSDT();

        vm.stopBroadcast();

        console.log("MockUSDT: ", address(usdt));
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BulletinBoard} from "src/core/BulletinBoard.sol";
import {Script, console} from "forge-std/Script.sol";

contract BulletinBoardScript is Script {
    function run() public {
        address agentToken = 0x65dcD3047bA46e2926CC4C077A8F8477B91F333b;
        address usdt = 0xe4b95df5D50F8ACa7b5Dd282922D1632c868d252;
        address priceConverter = 0x9b12Bcf86fAdd8f207C20ECCFc1f5b28F87bd585;

        vm.startBroadcast();

        BulletinBoard board = new BulletinBoard(agentToken, usdt, priceConverter);

        vm.stopBroadcast();

        console.log("BulletinBoard: ", address(board));
    }
}

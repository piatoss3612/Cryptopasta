// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {BulletinBoard} from "src/core/BulletinBoard.sol";
import {Script, console} from "forge-std/Script.sol";

contract BulletinBoardScript is Script {
    function run() public {
        address agentToken = 0xC16A43E63fa3D48797025dE4d3e838A9fb9C358c;
        address usdt = 0xe4b95df5D50F8ACa7b5Dd282922D1632c868d252;
        address priceConverter = 0x9b12Bcf86fAdd8f207C20ECCFc1f5b28F87bd585;

        vm.startBroadcast();

        BulletinBoard board = new BulletinBoard(agentToken, usdt, priceConverter);

        vm.stopBroadcast();

        console.log("BulletinBoard: ", address(board));
        console.log("Cryptopasta: ", address(board.CP()));
    }
}

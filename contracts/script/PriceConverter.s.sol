// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PriceConverter} from "src/chainlink/PriceConverter.sol";
import {Script, console} from "forge-std/Script.sol";

contract PriceConverterScript is Script {
    function run() public {
        address ethToUsdPriceFeed = 0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF;
        uint8 ethDecimals = 18;

        address usdtToUsdPriceFeed = 0x07F05C2aFeb54b68Ea425CAbCcbF53E2d5605d76;
        uint8 usdtDecimals = 6;

        vm.startBroadcast();

        PriceConverter converter = new PriceConverter(ethToUsdPriceFeed, ethDecimals, usdtToUsdPriceFeed, usdtDecimals);

        vm.stopBroadcast();

        console.log("PriceConverter: ", address(converter));

        uint256 usdAmount = 5 * 10 ** converter.USD_DECIMALS();

        uint256 etheAmount = converter.convertUSDToNativeAsset(usdAmount);

        console.log("5 USD to ETH: ", etheAmount);
    }
}

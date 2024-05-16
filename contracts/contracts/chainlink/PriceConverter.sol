// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "./interfaces/AggregatorV3Interface.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PriceConverter is Ownable {
    error InvalidPrice(int256 price);
    error InvalidPriceFeed(address asset);

    uint8 public constant USD_DECIMALS = 6; // This should be less than native asset decimals or USDT decimals

    AggregatorV3Interface public immutable NATIVE_ASSET_PRICE_FEED;
    uint8 public immutable NATIVE_ASSET_DECIMALS;

    AggregatorV3Interface public immutable USDT_PRICE_FEED;
    uint8 public immutable USDT_DECIMALS;

    constructor(address _baseAssetPriceFeed_, uint8 _baseAssetDeciamls, address _usdtPriceFeed_, uint8 _usdtDeciamls)
        Ownable(msg.sender)
    {
        NATIVE_ASSET_PRICE_FEED = AggregatorV3Interface(_baseAssetPriceFeed_);
        NATIVE_ASSET_DECIMALS = _baseAssetDeciamls;
        USDT_PRICE_FEED = AggregatorV3Interface(_usdtPriceFeed_);
        USDT_DECIMALS = _usdtDeciamls;
    }

    function latestNativeAssetPriceInUSD() public view returns (uint256 _price, uint8 _decimals) {
        (, int256 price,,,) = NATIVE_ASSET_PRICE_FEED.latestRoundData();
        if (price < 0) {
            revert InvalidPrice(price);
        }
        return (uint256(price), NATIVE_ASSET_PRICE_FEED.decimals());
    }

    function convertUSDToNativeAsset(uint256 _usdAmount) public view returns (uint256 _assetAmount) {
        (uint256 baseAssetPriceInUSD, uint8 priceDecimals) = latestNativeAssetPriceInUSD();

        _assetAmount = _usdAmount * (10 ** priceDecimals) / baseAssetPriceInUSD;
        _assetAmount *= 10 ** (NATIVE_ASSET_DECIMALS - USD_DECIMALS);
    }

    function latestUSDTPriceInUSD() public view returns (uint256 _price, uint8 _decimals) {
        (, int256 price,,,) = USDT_PRICE_FEED.latestRoundData();
        if (price < 0) {
            revert InvalidPrice(price);
        }
        return (uint256(price), USDT_PRICE_FEED.decimals());
    }

    function convertUSDToUSDT(uint256 _usdAmount) public view returns (uint256 _usdtAmount) {
        (uint256 usdtPriceInUSD, uint8 priceDecimals) = latestUSDTPriceInUSD();

        _usdtAmount = _usdAmount * (10 ** priceDecimals) / usdtPriceInUSD;
        _usdtAmount *= 10 ** (USDT_DECIMALS - USD_DECIMALS);
    }

    function convertUSDTToUSD(uint256 _usdtAmount) public view returns (uint256 _usdAmount) {
        (uint256 usdtPriceInUSD, uint8 priceDecimals) = latestUSDTPriceInUSD();

        _usdAmount = _usdtAmount * usdtPriceInUSD / (10 ** priceDecimals);
        _usdAmount = _usdAmount * 10 ** USD_DECIMALS / 10 ** USDT_DECIMALS;
    }

    function convertUSDTToNativeAsset(uint256 _usdtAmount) public view returns (uint256 _assetAmount) {
        (uint256 usdtPriceInUSD, uint8 priceDecimals) = latestUSDTPriceInUSD();

        uint256 _usdAmount = _usdtAmount * usdtPriceInUSD / (10 ** priceDecimals);
        _usdAmount = _usdAmount * 10 ** USD_DECIMALS;
        _assetAmount = convertUSDToNativeAsset(_usdAmount);
        _assetAmount /= 10 ** NATIVE_ASSET_DECIMALS;
    }

    function convertNativeAssetToUSD(uint256 _assetAmount) public view returns (uint256 _usdAmount) {
        (uint256 baseAssetPriceInUSD, uint8 priceDecimals) = latestNativeAssetPriceInUSD();

        _usdAmount = _assetAmount * baseAssetPriceInUSD / (10 ** priceDecimals);
        _usdAmount = _usdAmount * 10 ** USD_DECIMALS / 10 ** NATIVE_ASSET_DECIMALS;
    }

    function convertNativeAssetToUSDT(uint256 _assetAmount) public view returns (uint256 _usdtAmount) {
        (uint256 baseAssetPriceInUSD, uint8 priceDecimals) = latestNativeAssetPriceInUSD();

        uint256 _usdAmount = _assetAmount * baseAssetPriceInUSD / (10 ** priceDecimals);
        _usdAmount = _usdAmount * 10 ** USD_DECIMALS;
        _usdtAmount = convertUSDToUSDT(_usdAmount);
        _usdtAmount /= 10 ** NATIVE_ASSET_DECIMALS;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IMissionBoard} from "./interfaces/IMissionBoard.sol";
import {PriceConverter} from "../chainlink/PriceConverter.sol";
import {Cryptopasta} from "../token/Cryptopasta.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/// @title MissionBoard
/// @author piatoss
/// @notice A contract to report and rate discoveries
/// @dev The contract is used to report discoveries and rate them
/// The contract also supports sales and claims
contract MissionBoard is IMissionBoard, Ownable {
    uint8 private constant _RATING_DECIMALS = 6;
    uint256 private constant MIN_FEE = 1000;

    IERC721 public immutable AGENT;
    IERC20 public immutable USDT;
    Cryptopasta public immutable CP;
    PriceConverter public immutable PRICE_CONVERTER;

    uint256 private _reportId;
    uint128 private _reportingCostInUSD = 500000; // 0.5 USD

    mapping(uint256 => DiscoveryReport) private _reports;
    mapping(uint256 => RatingStats) private _ratings;
    mapping(uint256 => SalesStats) private _sales;
    mapping(address => mapping(uint256 => bool)) private _hasRated;
    mapping(address => uint256) private _ethBalances;
    mapping(address => uint256) private _usdtBalances;
    mapping(address => bool) private _usedFreeTrial;

    constructor(address _agent, address _usdt, address converter_) Ownable(msg.sender) {
        AGENT = IERC721(_agent);
        USDT = IERC20(_usdt);
        PRICE_CONVERTER = PriceConverter(converter_);
        CP = new Cryptopasta();
    }

    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IMissionBoard).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    /// @notice Returns the cost of reporting in USD
    /// @return cost The cost in USD
    /// @return decimals The decimals of the cost
    function reportingCostInUSD() external view override returns (uint256, uint8) {
        return (_reportingCostInUSD, PRICE_CONVERTER.USD_DECIMALS());
    }

    /// @notice Returns the cost of reporting in ETH
    /// @return cost The cost in ETH
    /// @return decimals The decimals of the cost
    function reportingCostInETH() external view override returns (uint256, uint8) {
        return (PRICE_CONVERTER.convertUSDToNativeAsset(_reportingCostInUSD), PRICE_CONVERTER.NATIVE_ASSET_DECIMALS());
    }

    /// @notice Returns the cost of reporting in USDT
    /// @return cost The cost in USDT
    /// @return decimals The decimals of the cost
    function reportingCostInUSDT() external view override returns (uint256, uint8) {
        return (PRICE_CONVERTER.convertUSDToUSDT(_reportingCostInUSD), PRICE_CONVERTER.USDT_DECIMALS());
    }

    /// @notice Returns the decimals of the rating
    /// @return decimals The decimals of the rating
    function ratingDecimals() external pure override returns (uint8) {
        return _RATING_DECIMALS;
    }

    /// @notice Returns the decimals of the USD price
    /// @return decimals The decimals of the USD price
    function usdPriceDecimals() external view override returns (uint8) {
        return PRICE_CONVERTER.USD_DECIMALS();
    }

    /// @notice Returns the discovery report
    /// @param reportId The report ID
    /// @return report The discovery report
    function getDiscoveryReport(uint256 reportId) public view override returns (DiscoveryReport memory) {
        _reportExists(reportId);
        return _reports[reportId];
    }

    /// @notice Returns the rating stats
    /// @param reportId The report ID
    /// @return stats The rating stats
    /// @return decimals The decimals of the rating
    function getRating(uint256 reportId) external view override returns (RatingStats memory, uint8) {
        _reportExists(reportId);
        return (_ratings[reportId], _RATING_DECIMALS);
    }

    /// @notice Returns the sales stats
    /// @param reportId The report ID
    /// @return stats The sales stats
    /// @return decimals The decimals of the price
    function getSales(uint256 reportId) external view override returns (SalesStats memory, uint8) {
        _reportExists(reportId);
        return (_sales[reportId], PRICE_CONVERTER.USD_DECIMALS());
    }

    /// @notice Returns if the rater has rated the report
    /// @param rater The rater address
    /// @param reportId The report ID
    /// @return rated True if the rater has rated the report
    function hasRated(address rater, uint256 reportId) public view returns (bool) {
        _reportExists(reportId);
        return _hasRated[rater][reportId];
    }

    /// @notice Returns if the user has the free trial
    /// @param user The user address
    /// @return True if the user has used the free trial
    function hasFreeTrial(address user) public view override returns (bool) {
        return !_usedFreeTrial[user];
    }

    /// @notice Returns the balance of the account
    /// @param account The account address
    /// @return ethBalance The ETH balance
    /// @return usdtBalance The USDT balance
    function getBalance(address account) external view override returns (uint256 ethBalance, uint256 usdtBalance) {
        return (_ethBalances[account], _usdtBalances[account]);
    }

    /// @notice Returns if the account is an agent
    /// @param account The account address
    /// @return True if the account is an agent
    function isAgent(address account) external view override returns (bool) {
        return AGENT.balanceOf(account) > 0;
    }

    /// @notice Creates a discovery report
    /// @param title The title of the discovery
    /// @param contentURI The URI of the content
    /// @param priceInUSD The price in USD
    /// @param paymentMethod The payment method
    function createReport(
        string memory title,
        string memory contentURI,
        uint128 priceInUSD,
        PaymentMethod paymentMethod
    ) external payable override {
        address reporter = msg.sender;

        // // Should be an agent
        _isAgent(reporter);

        // Check if the reporter has used the free trial
        if (hasFreeTrial(reporter)) {
            _usedFreeTrial[reporter] = true;
        } else {
            // // Check payment: reporter to owner
            uint256 paymentAmount = _pay(reporter, _reportingCostInUSD, paymentMethod);
            _updateBalances(owner(), paymentAmount, paymentMethod);
        }

        // Store report
        uint256 reportId = _reportId++;
        _reports[reportId] = DiscoveryReport({
            reporter: reporter,
            createdAt: uint48(block.timestamp),
            priceInUSD: priceInUSD,
            title: title,
            contentURI: contentURI
        });

        // Create Cryptopasta and mint one to the reporter
        // Report ID and token ID are binded
        CP.create(reportId, contentURI);
        CP.mint(reporter, reportId, 1, "");

        // Emit event
        emit ReportDiscovery(reportId, reporter, priceInUSD, title, contentURI);
    }

    /// @notice Takes(purchases) a discovery report
    /// @param reportId The report ID
    /// @param paymentMethod The payment method
    function buyReport(uint256 reportId, PaymentMethod paymentMethod) external payable {
        address buyer = msg.sender;

        // Report should exist
        _reportExists(reportId);

        uint256 priceInUSD = _reports[reportId].priceInUSD;

        // Check payment: buyer to reporter
        if (priceInUSD != 0) {
            uint256 paymentAmount = _pay(buyer, priceInUSD, paymentMethod);
            // Update sales stats
            _updateSales(reportId, paymentAmount, paymentMethod);
        }

        // Mint Cryptopasta
        CP.mint(buyer, reportId, 1, "");

        // Emit event
        emit ReportTaken(reportId, buyer, paymentMethod);
    }

    function _pay(address from, uint256 amount, PaymentMethod paymentMethod) private returns (uint256 paymentAmount) {
        // Currently only support USDT and ETH
        if (paymentMethod == PaymentMethod.USDT) {
            paymentAmount = PRICE_CONVERTER.convertUSDToUSDT(amount);
            USDT.transferFrom(from, address(this), paymentAmount);
        } else if (paymentMethod == PaymentMethod.ETHER) {
            paymentAmount = PRICE_CONVERTER.convertUSDToNativeAsset(amount);
            if (msg.value < paymentAmount) {
                revert MissionBoard__InvalidETHAmount(msg.value);
            }
        } else {
            revert MissionBoard__InvalidPaymentMethod();
        }
    }

    function _updateBalances(address to, uint256 amount, PaymentMethod paymentMethod) private {
        if (paymentMethod == PaymentMethod.ETHER) {
            _ethBalances[to] += amount;
        } else if (paymentMethod == PaymentMethod.USDT) {
            _usdtBalances[to] += amount;
        }
    }

    function _updateSales(uint256 reportId, uint256 amount, PaymentMethod paymentMethod) private {
        if (paymentMethod == PaymentMethod.ETHER) {
            _sales[reportId].salesInETH += uint128(amount);
        } else if (paymentMethod == PaymentMethod.USDT) {
            _sales[reportId].salesInUSDT += uint128(amount);
        }
    }

    /// @notice Rates a discovery report
    /// @param reportId The report ID
    /// @param rating The rating
    function rateReport(uint256 reportId, Rating rating) external {
        address rater = msg.sender;

        // Rater should be an agent
        _isAgent(rater);

        // Rater should not have rated this report
        if (hasRated(rater, reportId)) {
            revert MissionBoard__AlreadyRated(rater, reportId);
        }

        _hasRated[rater][reportId] = true;

        // Update rating stats
        // Rating is multiplied by 10^6 to keep the precision
        uint128 totalCountBefore = _ratings[reportId].totalCount;
        uint128 totalRatingBefore = _ratings[reportId].totalRating;

        uint128 totalCountAfter = totalCountBefore + 1;
        uint256 totalRatingAfter =
            (totalCountBefore * totalRatingBefore + uint128(rating) * (10 ** _RATING_DECIMALS)) / totalCountAfter;

        _ratings[reportId] = RatingStats({totalCount: totalCountAfter, totalRating: uint128(totalRatingAfter)});

        emit ReportRated(reportId, rater, rating);
    }

    /// @notice Returns if the user has report token (Cryptopasta)
    /// @param user The user address
    /// @param reportId The report ID
    function hasReport(address user, uint256 reportId) external view override returns (bool) {
        return CP.balanceOf(user, reportId) > 0;
    }

    /// @notice Claims the sales of a discovery report
    /// @param reportId The report ID
    function claimSales(uint256 reportId) external {
        _reportExists(reportId);

        address caller = msg.sender;
        // Only the report owner can claim sales
        if (caller != _reports[reportId].reporter) {
            revert MissionBoard__NotReportOwner(caller, reportId);
        }

        SalesStats memory reportSales = _sales[reportId];

        // Calculate claimable sales
        uint256 claimableInETH;
        if (reportSales.salesInETH > reportSales.claimedInETH) {
            claimableInETH = reportSales.salesInETH - reportSales.claimedInETH;
        }

        uint256 actualClaimedInETH;

        if (claimableInETH > 0) {
            // take 3% fee
            uint256 fee = (claimableInETH * 30) / 1000;
            if (fee < MIN_FEE) {
                fee = MIN_FEE;
            }

            // Check if there is enough sales for the fee
            if (fee <= claimableInETH) {
                // Update sales stats
                _sales[reportId].claimedInETH += uint128(claimableInETH);
                actualClaimedInETH = claimableInETH - fee;
                _ethBalances[caller] += actualClaimedInETH;
                _ethBalances[owner()] += fee;
            }
        }

        uint256 claimableInUSDT;
        if (reportSales.salesInUSDT > reportSales.claimedInUSDT) {
            claimableInUSDT = reportSales.salesInUSDT - reportSales.claimedInUSDT;
        }

        uint256 actualClaimedInUSDT;

        if (claimableInUSDT > 0) {
            // take 3% fee
            uint256 fee = (claimableInUSDT * 30) / 1000;
            if (fee < MIN_FEE) {
                fee = MIN_FEE;
            }

            // Check if there is enough sales for the fee
            if (fee <= claimableInUSDT) {
                // Update sales stats
                _sales[reportId].claimedInUSDT += uint128(claimableInUSDT);
                actualClaimedInUSDT = claimableInUSDT - fee;
                _usdtBalances[caller] += actualClaimedInUSDT;
                _usdtBalances[owner()] += fee;
            }
        }

        emit SalesClaimed(reportId, caller, actualClaimedInETH, actualClaimedInUSDT);
    }

    /// @notice Withdraws the balance
    /// @param to The receiver address
    /// @param amount The amount to withdraw
    /// @param paymentMethod The payment method
    function withdraw(address payable to, uint256 amount, PaymentMethod paymentMethod) external {
        if (paymentMethod == PaymentMethod.ETHER) {
            // Check if there is enough balance
            if (_ethBalances[msg.sender] < amount) {
                revert MissionBoard__InsufficientBalance(msg.sender, amount, paymentMethod);
            }

            // Update balance and transfer
            _ethBalances[msg.sender] -= amount;
            (bool ok,) = to.call{value: amount}("");
            if (!ok) {
                revert MissionBoard__TransferFailed();
            }
        } else if (paymentMethod == PaymentMethod.USDT) {
            // Check if there is enough balance
            if (_usdtBalances[msg.sender] < amount) {
                revert MissionBoard__InsufficientBalance(msg.sender, amount, paymentMethod);
            }
            // Update balance and transfer
            _usdtBalances[msg.sender] -= amount;
            USDT.transfer(to, amount);
        } else {
            revert MissionBoard__InvalidPaymentMethod();
        }
    }

    function _isAgent(address account) private view returns (bool flag) {
        flag = true;
        if (AGENT.balanceOf(account) == 0) {
            revert MissionBoard__NotAgent(account);
        }
    }

    function _reportExists(uint256 reportId) private view returns (bool flag) {
        flag = true;
        if (reportId > _reportId) {
            revert MissionBoard__ReportNotFound(reportId);
        }
    }

    fallback() external payable {}
    receive() external payable {}
}

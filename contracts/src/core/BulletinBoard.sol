// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IBulletinBoard} from "./interfaces/IBulletinBoard.sol";
import {PriceConverter} from "../chainlink/PriceConverter.sol";
import {Cryptopasta} from "../token/Cryptopasta.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract BulletinBoard is IBulletinBoard, Ownable {
    uint8 private constant _RATING_DECIMALS = 6;
    uint256 private constant MIN_FEE = 1000;

    IERC721 public immutable AGENT;
    IERC20 public immutable USDT;
    Cryptopasta public immutable CP;

    PriceConverter private _converter;

    uint256 private _reportId;
    uint128 private _reportingCostInUSD = 50000000; // 0.5 USD

    mapping(uint256 => DiscoveryReport) private _reports;
    mapping(uint256 => RatingStats) private _ratings;
    mapping(uint256 => SalesStats) private _sales;
    mapping(address => mapping(uint256 => bool)) private _hasRated;
    mapping(address => uint256) private _ethBalances;
    mapping(address => uint256) private _usdtBalances;

    constructor(PriceConverter converter_, address _agent, address _usdt) Ownable(msg.sender) {
        _converter = converter_;
        AGENT = IERC721(_agent);
        USDT = IERC20(_usdt);
        CP = new Cryptopasta();
    }

    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IBulletinBoard).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    function reportingCostInUSD() external view override returns (uint256, uint8) {
        return (_reportingCostInUSD, _converter.USD_DECIMALS());
    }

    function reportingCostInETH() external view override returns (uint256, uint8) {
        return (_converter.convertUSDToNativeAsset(_reportingCostInUSD), _converter.NATIVE_ASSET_DECIMALS());
    }

    function reportingCostInUSDT() external view override returns (uint256, uint8) {
        return (_converter.convertUSDToUSDT(_reportingCostInUSD), _converter.USDT_DECIMALS());
    }

    function ratingDecimals() external pure override returns (uint8) {
        return _RATING_DECIMALS;
    }

    function usdPriceDecimals() external view override returns (uint8) {
        return _converter.USD_DECIMALS();
    }

    function getDiscoveryReport(uint256 reportId) public view override returns (DiscoveryReport memory) {
        if (reportId > _reportId) {
            revert BulletinBoard__ReportNotFound(reportId);
        }
        return _reports[reportId];
    }

    function getRating(uint256 reportId) external view override returns (RatingStats memory, uint8) {
        if (reportId > _reportId) {
            revert BulletinBoard__ReportNotFound(reportId);
        }
        return (_ratings[reportId], _RATING_DECIMALS);
    }

    function getSales(uint256 reportId) external view override returns (SalesStats memory, uint8) {
        if (reportId > _reportId) {
            revert BulletinBoard__ReportNotFound(reportId);
        }
        return (_sales[reportId], _converter.USD_DECIMALS());
    }

    function hasRated(address rater, uint256 reportId) public view returns (bool) {
        if (reportId > _reportId) {
            revert BulletinBoard__ReportNotFound(reportId);
        }
        return _hasRated[rater][reportId];
    }

    function reportDiscovery(
        string memory title,
        string memory contentURI,
        uint128 priceInUSD,
        PaymentMethod paymentMethod
    ) external payable override {
        address reporter = msg.sender;
        if (AGENT.balanceOf(reporter) == 0) {
            revert BulletinBoard__NotAgent(reporter);
        }

        // Check payment: reporter to owner
        uint256 paymentAmount = _pay(reporter, _reportingCostInUSD, paymentMethod);
        _updateBalances(owner(), paymentAmount, paymentMethod);

        // Store report
        uint256 reportId = _reportId++;
        _reports[reportId] = DiscoveryReport({
            reporter: reporter,
            createdAt: uint48(block.timestamp),
            priceInUSD: priceInUSD,
            title: title,
            contentURI: contentURI
        });

        // Mint CP
        CP.create(reportId, contentURI);
        CP.mint(reporter, reportId, 1, "");

        // Emit event
        emit ReportDiscovery(reportId, reporter, priceInUSD, title, contentURI);
    }

    function takeReport(uint256 reportId, PaymentMethod paymentMethod) external payable {
        address buyer = msg.sender;

        if (reportId > _reportId) {
            revert BulletinBoard__ReportNotFound(reportId);
        }

        uint256 priceInUSD = _reports[reportId].priceInUSD;

        // Check payment: buyer to reporter
        if (priceInUSD != 0) {
            uint256 paymentAmount = _pay(buyer, priceInUSD, paymentMethod);
            _updateSales(reportId, paymentAmount, paymentMethod);
        }

        // Mint Cryptopasta
        CP.mint(buyer, reportId, 1, "");

        // Emit event
        emit ReportTaken(reportId, buyer, paymentMethod);
    }

    function _pay(address from, uint256 amount, PaymentMethod paymentMethod) private returns (uint256) {
        if (paymentMethod == PaymentMethod.USDT) {
            uint256 usdtAmount = _converter.convertUSDToUSDT(amount);
            USDT.transferFrom(from, address(this), usdtAmount);
            return usdtAmount;
        } else if (paymentMethod == PaymentMethod.ETHER) {
            uint256 ethAmount = _converter.convertUSDToNativeAsset(amount);
            if (msg.value != ethAmount) {
                revert BulletinBoard__InvalidETHAmount(msg.value);
            }
            return ethAmount;
        } else {
            revert BulletinBoard__InvalidPaymentMethod();
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

    function rateReport(uint256 reportId, Rating rating) external {
        address rater = msg.sender;
        if (hasRated(rater, reportId)) {
            revert BulletinBoard__AlreadyRated(rater, reportId);
        }

        _hasRated[rater][reportId] = true;

        uint128 totalCountBefore = _ratings[reportId].totalCount;
        uint128 totalRatingBefore = _ratings[reportId].totalRating;

        uint128 totalCountAfter = totalCountBefore + 1;
        uint256 totalRatingAfter =
            (totalCountBefore * totalRatingBefore + uint128(rating) * 10 ** _RATING_DECIMALS) / totalCountAfter;

        _ratings[reportId] = RatingStats({totalCount: totalCountAfter, totalRating: uint128(totalRatingAfter)});

        emit ReportRated(reportId, rater, rating);
    }

    function claimSales(uint256 reportId) external {
        if (reportId > _reportId) {
            revert BulletinBoard__ReportNotFound(reportId);
        }

        address caller = msg.sender;
        if (caller != _reports[reportId].reporter) {
            revert BulletinBoard__NotReportOwner(caller, reportId);
        }

        SalesStats storage sales = _sales[reportId];

        uint256 claimableInETH = sales.salesInETH - sales.claimedInETH;
        uint256 claimableInUSDT = sales.salesInUSDT - sales.claimedInUSDT;

        if (claimableInETH > 0) {
            // take 3% fee
            uint256 fee = (claimableInETH * 3) / 100;
            if (fee < MIN_FEE) {
                fee = MIN_FEE;
            }

            sales.claimedInETH += uint128(claimableInETH);
            _ethBalances[caller] += claimableInETH - fee;
            _ethBalances[owner()] += fee;
        }

        if (claimableInUSDT > 0) {
            // take 3% fee
            uint256 fee = (claimableInUSDT * 3) / 100;
            if (fee < MIN_FEE) {
                fee = MIN_FEE;
            }

            sales.claimedInUSDT += uint128(claimableInUSDT);
            _usdtBalances[caller] += claimableInUSDT - fee;
            _usdtBalances[owner()] += fee;
        }

        emit SalesClaimed(reportId, caller, claimableInETH, claimableInUSDT);
    }

    function withdraw(address to, uint256 amount, PaymentMethod paymentMethod) external {
        if (paymentMethod == PaymentMethod.ETHER) {
            if (_ethBalances[msg.sender] < amount) {
                revert BulletinBoard__InsufficientBalance(msg.sender, amount, paymentMethod);
            }

            _ethBalances[msg.sender] -= amount;
            payable(to).transfer(amount);
        } else if (paymentMethod == PaymentMethod.USDT) {
            if (_usdtBalances[msg.sender] < amount) {
                revert BulletinBoard__InsufficientBalance(msg.sender, amount, paymentMethod);
            }
            _usdtBalances[msg.sender] -= amount;
            USDT.transfer(to, amount);
        } else {
            revert BulletinBoard__InvalidPaymentMethod();
        }
    }

    receive() external payable {}
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IBulletinBoard is IERC165 {
    error BulletinBoard__ReportNotFound(uint256 reportId);
    error BulletinBoard__NotAgent(address caller);
    error BulletinBoard__InvalidETHAmount(uint256 amount);
    error BulletinBoard__InvalidPaymentMethod();
    error BulletinBoard__AlreadyRated(address rater, uint256 reportId);
    error BulletinBoard__NotReportOwner(address caller, uint256 reportId);
    error BulletinBoard__InsufficientBalance(address caller, uint256 amount, PaymentMethod paymentMethod);
    error BulletinBoard__InsufficientSalesForClaim(uint256 reportId);
    error BulletinBoard__TransferFailed();

    enum Rating {
        F,
        D,
        C,
        B,
        A,
        S
    }

    enum PaymentMethod {
        ETHER,
        USDT
    }

    struct DiscoveryReport {
        address reporter;
        uint48 createdAt;
        uint128 priceInUSD;
        string title;
        string contentURI;
    }

    struct RatingStats {
        uint128 totalCount;
        uint128 totalRating;
    }

    struct SalesStats {
        uint128 salesInETH;
        uint128 salesInUSDT;
        uint128 claimedInETH;
        uint128 claimedInUSDT;
    }

    event ReportDiscovery(
        uint256 indexed reportId, address indexed reporter, uint128 priceInUSD, string title, string contentURI
    );
    event ReportTaken(uint256 indexed reportId, address indexed buyer, PaymentMethod paymentMethod);
    event ReportRated(uint256 indexed reportId, address indexed rater, Rating rating);
    event SalesClaimed(uint256 indexed reportId, address indexed caller, uint256 amountInETH, uint256 amountInUSDT);

    function reportingCostInUSD() external view returns (uint256, uint8);
    function reportingCostInETH() external view returns (uint256, uint8);
    function reportingCostInUSDT() external view returns (uint256, uint8);
    function ratingDecimals() external view returns (uint8);
    function usdPriceDecimals() external view returns (uint8);
    function getDiscoveryReport(uint256 reportId) external view returns (DiscoveryReport memory);
    function getRating(uint256 reportId) external view returns (RatingStats memory, uint8);
    function getSales(uint256 reportId) external view returns (SalesStats memory, uint8);
    function hasRated(address rater, uint256 reportId) external view returns (bool);

    function createReport(
        string memory title,
        string memory contentURI,
        uint128 priceInUSD,
        PaymentMethod paymentMethod
    ) external payable;
    function buyReport(uint256 reportId, PaymentMethod paymentMethod) external payable;
    function rateReport(uint256 reportId, Rating rating) external;
    function claimSales(uint256 reportId) external;
    function withdraw(address to, uint256 amount, PaymentMethod paymentMethod) external;
}

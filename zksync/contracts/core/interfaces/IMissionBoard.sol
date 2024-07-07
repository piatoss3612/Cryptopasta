// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IMissionBoard is IERC165 {
    error MissionBoard__ReportNotFound(uint256 reportId);
    error MissionBoard__NotAgent(address caller);
    error MissionBoard__InvalidETHAmount(uint256 amount);
    error MissionBoard__InvalidPaymentMethod();
    error MissionBoard__AlreadyRated(address rater, uint256 reportId);
    error MissionBoard__NotReportOwner(address caller, uint256 reportId);
    error MissionBoard__InsufficientBalance(address caller, uint256 amount, PaymentMethod paymentMethod);
    error MissionBoard__InsufficientSalesForClaim(uint256 reportId);
    error MissionBoard__TransferFailed();

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
    function hasFreeTrial(address user) external view returns (bool);
    function getBalance(address account) external view returns (uint256, uint256);
    function isAgent(address account) external view returns (bool);

    function createReport(
        string memory title,
        string memory contentURI,
        uint128 priceInUSD,
        PaymentMethod paymentMethod
    ) external payable;
    function buyReport(uint256 reportId, PaymentMethod paymentMethod) external payable;
    function rateReport(uint256 reportId, Rating rating) external;
    function claimSales(uint256 reportId) external;
    function withdraw(address payable to, uint256 amount, PaymentMethod paymentMethod) external;
}

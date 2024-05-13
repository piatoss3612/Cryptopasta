const BulletinBoardAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_agent",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdt",
        type: "address",
      },
      {
        internalType: "address",
        name: "converter_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "rater",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "BulletinBoard__AlreadyRated",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "enum IBulletinBoard.PaymentMethod",
        name: "paymentMethod",
        type: "uint8",
      },
    ],
    name: "BulletinBoard__InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "BulletinBoard__InsufficientSalesForClaim",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "BulletinBoard__InvalidETHAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "BulletinBoard__InvalidPaymentMethod",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
    ],
    name: "BulletinBoard__NotAgent",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "BulletinBoard__NotReportOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "BulletinBoard__ReportNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "BulletinBoard__TransferFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "reporter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "priceInUSD",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "contentURI",
        type: "string",
      },
    ],
    name: "ReportDiscovery",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "rater",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IBulletinBoard.Rating",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "ReportRated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "enum IBulletinBoard.PaymentMethod",
        name: "paymentMethod",
        type: "uint8",
      },
    ],
    name: "ReportTaken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "caller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountInETH",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountInUSDT",
        type: "uint256",
      },
    ],
    name: "SalesClaimed",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    inputs: [],
    name: "AGENT",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "CP",
    outputs: [
      {
        internalType: "contract Cryptopasta",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PRICE_CONVERTER",
    outputs: [
      {
        internalType: "contract PriceConverter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "USDT",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        internalType: "enum IBulletinBoard.PaymentMethod",
        name: "paymentMethod",
        type: "uint8",
      },
    ],
    name: "buyReport",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "claimSales",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "string",
        name: "contentURI",
        type: "string",
      },
      {
        internalType: "uint128",
        name: "priceInUSD",
        type: "uint128",
      },
      {
        internalType: "enum IBulletinBoard.PaymentMethod",
        name: "paymentMethod",
        type: "uint8",
      },
    ],
    name: "createReport",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "getDiscoveryReport",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "reporter",
            type: "address",
          },
          {
            internalType: "uint48",
            name: "createdAt",
            type: "uint48",
          },
          {
            internalType: "uint128",
            name: "priceInUSD",
            type: "uint128",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "contentURI",
            type: "string",
          },
        ],
        internalType: "struct IBulletinBoard.DiscoveryReport",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "getRating",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "totalCount",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "totalRating",
            type: "uint128",
          },
        ],
        internalType: "struct IBulletinBoard.RatingStats",
        name: "",
        type: "tuple",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "getSales",
    outputs: [
      {
        components: [
          {
            internalType: "uint128",
            name: "salesInETH",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "salesInUSDT",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "claimedInETH",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "claimedInUSDT",
            type: "uint128",
          },
        ],
        internalType: "struct IBulletinBoard.SalesStats",
        name: "",
        type: "tuple",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "rater",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
    ],
    name: "hasRated",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        internalType: "enum IBulletinBoard.Rating",
        name: "rating",
        type: "uint8",
      },
    ],
    name: "rateReport",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ratingDecimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reportingCostInETH",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reportingCostInUSD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "reportingCostInUSDT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdPriceDecimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "enum IBulletinBoard.PaymentMethod",
        name: "paymentMethod",
        type: "uint8",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

export default BulletinBoardAbi;

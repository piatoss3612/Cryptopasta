const BulletinBoardAbi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_agent",
        type: "address",
        internalType: "address",
      },
      {
        name: "_usdt",
        type: "address",
        internalType: "address",
      },
      {
        name: "converter_",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "AGENT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC721",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "CP",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract Cryptopasta",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "PRICE_CONVERTER",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract PriceConverter",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "USDT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "contract IERC20",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimSales",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDiscoveryReport",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IBulletinBoard.DiscoveryReport",
        components: [
          {
            name: "reporter",
            type: "address",
            internalType: "address",
          },
          {
            name: "createdAt",
            type: "uint48",
            internalType: "uint48",
          },
          {
            name: "priceInUSD",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "title",
            type: "string",
            internalType: "string",
          },
          {
            name: "contentURI",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getRating",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IBulletinBoard.RatingStats",
        components: [
          {
            name: "totalCount",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "totalRating",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getSales",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct IBulletinBoard.SalesStats",
        components: [
          {
            name: "salesInETH",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "salesInUSDT",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "claimedInETH",
            type: "uint128",
            internalType: "uint128",
          },
          {
            name: "claimedInUSDT",
            type: "uint128",
            internalType: "uint128",
          },
        ],
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasRated",
    inputs: [
      {
        name: "rater",
        type: "address",
        internalType: "address",
      },
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rateReport",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "rating",
        type: "uint8",
        internalType: "enum IBulletinBoard.Rating",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "ratingDecimals",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "reportDiscovery",
    inputs: [
      {
        name: "title",
        type: "string",
        internalType: "string",
      },
      {
        name: "contentURI",
        type: "string",
        internalType: "string",
      },
      {
        name: "priceInUSD",
        type: "uint128",
        internalType: "uint128",
      },
      {
        name: "paymentMethod",
        type: "uint8",
        internalType: "enum IBulletinBoard.PaymentMethod",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "reportingCostInETH",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reportingCostInUSD",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reportingCostInUSDT",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "takeReport",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "paymentMethod",
        type: "uint8",
        internalType: "enum IBulletinBoard.PaymentMethod",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "usdPriceDecimals",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "uint8",
        internalType: "uint8",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdraw",
    inputs: [
      {
        name: "to",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "paymentMethod",
        type: "uint8",
        internalType: "enum IBulletinBoard.PaymentMethod",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ReportDiscovery",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "reporter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "priceInUSD",
        type: "uint128",
        indexed: false,
        internalType: "uint128",
      },
      {
        name: "title",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "contentURI",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ReportRated",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "rater",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "rating",
        type: "uint8",
        indexed: false,
        internalType: "enum IBulletinBoard.Rating",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ReportTaken",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "buyer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "paymentMethod",
        type: "uint8",
        indexed: false,
        internalType: "enum IBulletinBoard.PaymentMethod",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "SalesClaimed",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "caller",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "amountInETH",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amountInUSDT",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "BulletinBoard__AlreadyRated",
    inputs: [
      {
        name: "rater",
        type: "address",
        internalType: "address",
      },
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "BulletinBoard__InsufficientBalance",
    inputs: [
      {
        name: "caller",
        type: "address",
        internalType: "address",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "paymentMethod",
        type: "uint8",
        internalType: "enum IBulletinBoard.PaymentMethod",
      },
    ],
  },
  {
    type: "error",
    name: "BulletinBoard__InsufficientSalesForClaim",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "BulletinBoard__InvalidETHAmount",
    inputs: [
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "BulletinBoard__InvalidPaymentMethod",
    inputs: [],
  },
  {
    type: "error",
    name: "BulletinBoard__NotAgent",
    inputs: [
      {
        name: "caller",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "BulletinBoard__NotReportOwner",
    inputs: [
      {
        name: "caller",
        type: "address",
        internalType: "address",
      },
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "BulletinBoard__ReportNotFound",
    inputs: [
      {
        name: "reportId",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "error",
    name: "BulletinBoard__TransferFailed",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;

export default BulletinBoardAbi;
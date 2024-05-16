/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IMissionBoard,
  IMissionBoardInterface,
} from "../../../../contracts/core/interfaces/IMissionBoard";

const _abi = [
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
    name: "MissionBoard__AlreadyRated",
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
        internalType: "enum IMissionBoard.PaymentMethod",
        name: "paymentMethod",
        type: "uint8",
      },
    ],
    name: "MissionBoard__InsufficientBalance",
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
    name: "MissionBoard__InsufficientSalesForClaim",
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
    name: "MissionBoard__InvalidETHAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "MissionBoard__InvalidPaymentMethod",
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
    name: "MissionBoard__NotAgent",
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
    name: "MissionBoard__NotReportOwner",
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
    name: "MissionBoard__ReportNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "MissionBoard__TransferFailed",
    type: "error",
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
        internalType: "enum IMissionBoard.Rating",
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
        internalType: "enum IMissionBoard.PaymentMethod",
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
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        internalType: "enum IMissionBoard.PaymentMethod",
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
        internalType: "enum IMissionBoard.PaymentMethod",
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
        internalType: "struct IMissionBoard.DiscoveryReport",
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
        internalType: "struct IMissionBoard.RatingStats",
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
        internalType: "struct IMissionBoard.SalesStats",
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
    inputs: [
      {
        internalType: "uint256",
        name: "reportId",
        type: "uint256",
      },
      {
        internalType: "enum IMissionBoard.Rating",
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
    stateMutability: "view",
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
    stateMutability: "view",
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
        internalType: "address payable",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "enum IMissionBoard.PaymentMethod",
        name: "paymentMethod",
        type: "uint8",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IMissionBoard__factory {
  static readonly abi = _abi;
  static createInterface(): IMissionBoardInterface {
    return new Interface(_abi) as IMissionBoardInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IMissionBoard {
    return new Contract(address, _abi, runner) as unknown as IMissionBoard;
  }
}

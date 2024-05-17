/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace IMissionBoard {
  export type DiscoveryReportStruct = {
    reporter: AddressLike;
    createdAt: BigNumberish;
    priceInUSD: BigNumberish;
    title: string;
    contentURI: string;
  };

  export type DiscoveryReportStructOutput = [
    reporter: string,
    createdAt: bigint,
    priceInUSD: bigint,
    title: string,
    contentURI: string
  ] & {
    reporter: string;
    createdAt: bigint;
    priceInUSD: bigint;
    title: string;
    contentURI: string;
  };

  export type RatingStatsStruct = {
    totalCount: BigNumberish;
    totalRating: BigNumberish;
  };

  export type RatingStatsStructOutput = [
    totalCount: bigint,
    totalRating: bigint
  ] & { totalCount: bigint; totalRating: bigint };

  export type SalesStatsStruct = {
    salesInETH: BigNumberish;
    salesInUSDT: BigNumberish;
    claimedInETH: BigNumberish;
    claimedInUSDT: BigNumberish;
  };

  export type SalesStatsStructOutput = [
    salesInETH: bigint,
    salesInUSDT: bigint,
    claimedInETH: bigint,
    claimedInUSDT: bigint
  ] & {
    salesInETH: bigint;
    salesInUSDT: bigint;
    claimedInETH: bigint;
    claimedInUSDT: bigint;
  };
}

export interface MissionBoardInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "AGENT"
      | "CP"
      | "PRICE_CONVERTER"
      | "USDT"
      | "buyReport"
      | "claimSales"
      | "createReport"
      | "getDiscoveryReport"
      | "getRating"
      | "getSales"
      | "hasRated"
      | "owner"
      | "rateReport"
      | "ratingDecimals"
      | "renounceOwnership"
      | "reportingCostInETH"
      | "reportingCostInUSD"
      | "reportingCostInUSDT"
      | "supportsInterface"
      | "transferOwnership"
      | "usdPriceDecimals"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "OwnershipTransferred"
      | "ReportDiscovery"
      | "ReportRated"
      | "ReportTaken"
      | "SalesClaimed"
  ): EventFragment;

  encodeFunctionData(functionFragment: "AGENT", values?: undefined): string;
  encodeFunctionData(functionFragment: "CP", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "PRICE_CONVERTER",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "USDT", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "buyReport",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimSales",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createReport",
    values: [string, string, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getDiscoveryReport",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRating",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getSales",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRated",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "rateReport",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ratingDecimals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reportingCostInETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reportingCostInUSD",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "reportingCostInUSDT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "usdPriceDecimals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "AGENT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "CP", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "PRICE_CONVERTER",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "USDT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "buyReport", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimSales", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createReport",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getDiscoveryReport",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRating", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getSales", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRated", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rateReport", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ratingDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reportingCostInETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reportingCostInUSD",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "reportingCostInUSDT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "usdPriceDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ReportDiscoveryEvent {
  export type InputTuple = [
    reportId: BigNumberish,
    reporter: AddressLike,
    priceInUSD: BigNumberish,
    title: string,
    contentURI: string
  ];
  export type OutputTuple = [
    reportId: bigint,
    reporter: string,
    priceInUSD: bigint,
    title: string,
    contentURI: string
  ];
  export interface OutputObject {
    reportId: bigint;
    reporter: string;
    priceInUSD: bigint;
    title: string;
    contentURI: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ReportRatedEvent {
  export type InputTuple = [
    reportId: BigNumberish,
    rater: AddressLike,
    rating: BigNumberish
  ];
  export type OutputTuple = [reportId: bigint, rater: string, rating: bigint];
  export interface OutputObject {
    reportId: bigint;
    rater: string;
    rating: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ReportTakenEvent {
  export type InputTuple = [
    reportId: BigNumberish,
    buyer: AddressLike,
    paymentMethod: BigNumberish
  ];
  export type OutputTuple = [
    reportId: bigint,
    buyer: string,
    paymentMethod: bigint
  ];
  export interface OutputObject {
    reportId: bigint;
    buyer: string;
    paymentMethod: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SalesClaimedEvent {
  export type InputTuple = [
    reportId: BigNumberish,
    caller: AddressLike,
    amountInETH: BigNumberish,
    amountInUSDT: BigNumberish
  ];
  export type OutputTuple = [
    reportId: bigint,
    caller: string,
    amountInETH: bigint,
    amountInUSDT: bigint
  ];
  export interface OutputObject {
    reportId: bigint;
    caller: string;
    amountInETH: bigint;
    amountInUSDT: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface MissionBoard extends BaseContract {
  connect(runner?: ContractRunner | null): MissionBoard;
  waitForDeployment(): Promise<this>;

  interface: MissionBoardInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  AGENT: TypedContractMethod<[], [string], "view">;

  CP: TypedContractMethod<[], [string], "view">;

  PRICE_CONVERTER: TypedContractMethod<[], [string], "view">;

  USDT: TypedContractMethod<[], [string], "view">;

  buyReport: TypedContractMethod<
    [reportId: BigNumberish, paymentMethod: BigNumberish],
    [void],
    "payable"
  >;

  claimSales: TypedContractMethod<
    [reportId: BigNumberish],
    [void],
    "nonpayable"
  >;

  createReport: TypedContractMethod<
    [
      title: string,
      contentURI: string,
      priceInUSD: BigNumberish,
      paymentMethod: BigNumberish
    ],
    [void],
    "payable"
  >;

  getDiscoveryReport: TypedContractMethod<
    [reportId: BigNumberish],
    [IMissionBoard.DiscoveryReportStructOutput],
    "view"
  >;

  getRating: TypedContractMethod<
    [reportId: BigNumberish],
    [[IMissionBoard.RatingStatsStructOutput, bigint]],
    "view"
  >;

  getSales: TypedContractMethod<
    [reportId: BigNumberish],
    [[IMissionBoard.SalesStatsStructOutput, bigint]],
    "view"
  >;

  hasRated: TypedContractMethod<
    [rater: AddressLike, reportId: BigNumberish],
    [boolean],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  rateReport: TypedContractMethod<
    [reportId: BigNumberish, rating: BigNumberish],
    [void],
    "nonpayable"
  >;

  ratingDecimals: TypedContractMethod<[], [bigint], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  reportingCostInETH: TypedContractMethod<[], [[bigint, bigint]], "view">;

  reportingCostInUSD: TypedContractMethod<[], [[bigint, bigint]], "view">;

  reportingCostInUSDT: TypedContractMethod<[], [[bigint, bigint]], "view">;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  usdPriceDecimals: TypedContractMethod<[], [bigint], "view">;

  withdraw: TypedContractMethod<
    [to: AddressLike, amount: BigNumberish, paymentMethod: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "AGENT"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(nameOrSignature: "CP"): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "PRICE_CONVERTER"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "USDT"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "buyReport"
  ): TypedContractMethod<
    [reportId: BigNumberish, paymentMethod: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "claimSales"
  ): TypedContractMethod<[reportId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "createReport"
  ): TypedContractMethod<
    [
      title: string,
      contentURI: string,
      priceInUSD: BigNumberish,
      paymentMethod: BigNumberish
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "getDiscoveryReport"
  ): TypedContractMethod<
    [reportId: BigNumberish],
    [IMissionBoard.DiscoveryReportStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRating"
  ): TypedContractMethod<
    [reportId: BigNumberish],
    [[IMissionBoard.RatingStatsStructOutput, bigint]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getSales"
  ): TypedContractMethod<
    [reportId: BigNumberish],
    [[IMissionBoard.SalesStatsStructOutput, bigint]],
    "view"
  >;
  getFunction(
    nameOrSignature: "hasRated"
  ): TypedContractMethod<
    [rater: AddressLike, reportId: BigNumberish],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "rateReport"
  ): TypedContractMethod<
    [reportId: BigNumberish, rating: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "ratingDecimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "reportingCostInETH"
  ): TypedContractMethod<[], [[bigint, bigint]], "view">;
  getFunction(
    nameOrSignature: "reportingCostInUSD"
  ): TypedContractMethod<[], [[bigint, bigint]], "view">;
  getFunction(
    nameOrSignature: "reportingCostInUSDT"
  ): TypedContractMethod<[], [[bigint, bigint]], "view">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "usdPriceDecimals"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish, paymentMethod: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "ReportDiscovery"
  ): TypedContractEvent<
    ReportDiscoveryEvent.InputTuple,
    ReportDiscoveryEvent.OutputTuple,
    ReportDiscoveryEvent.OutputObject
  >;
  getEvent(
    key: "ReportRated"
  ): TypedContractEvent<
    ReportRatedEvent.InputTuple,
    ReportRatedEvent.OutputTuple,
    ReportRatedEvent.OutputObject
  >;
  getEvent(
    key: "ReportTaken"
  ): TypedContractEvent<
    ReportTakenEvent.InputTuple,
    ReportTakenEvent.OutputTuple,
    ReportTakenEvent.OutputObject
  >;
  getEvent(
    key: "SalesClaimed"
  ): TypedContractEvent<
    SalesClaimedEvent.InputTuple,
    SalesClaimedEvent.OutputTuple,
    SalesClaimedEvent.OutputObject
  >;

  filters: {
    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;

    "ReportDiscovery(uint256,address,uint128,string,string)": TypedContractEvent<
      ReportDiscoveryEvent.InputTuple,
      ReportDiscoveryEvent.OutputTuple,
      ReportDiscoveryEvent.OutputObject
    >;
    ReportDiscovery: TypedContractEvent<
      ReportDiscoveryEvent.InputTuple,
      ReportDiscoveryEvent.OutputTuple,
      ReportDiscoveryEvent.OutputObject
    >;

    "ReportRated(uint256,address,uint8)": TypedContractEvent<
      ReportRatedEvent.InputTuple,
      ReportRatedEvent.OutputTuple,
      ReportRatedEvent.OutputObject
    >;
    ReportRated: TypedContractEvent<
      ReportRatedEvent.InputTuple,
      ReportRatedEvent.OutputTuple,
      ReportRatedEvent.OutputObject
    >;

    "ReportTaken(uint256,address,uint8)": TypedContractEvent<
      ReportTakenEvent.InputTuple,
      ReportTakenEvent.OutputTuple,
      ReportTakenEvent.OutputObject
    >;
    ReportTaken: TypedContractEvent<
      ReportTakenEvent.InputTuple,
      ReportTakenEvent.OutputTuple,
      ReportTakenEvent.OutputObject
    >;

    "SalesClaimed(uint256,address,uint256,uint256)": TypedContractEvent<
      SalesClaimedEvent.InputTuple,
      SalesClaimedEvent.OutputTuple,
      SalesClaimedEvent.OutputObject
    >;
    SalesClaimed: TypedContractEvent<
      SalesClaimedEvent.InputTuple,
      SalesClaimedEvent.OutputTuple,
      SalesClaimedEvent.OutputObject
    >;
  };
}
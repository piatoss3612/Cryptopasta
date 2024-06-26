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
} from "../../../common";

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

export interface IMissionBoardInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "buyReport"
      | "claimSales"
      | "createReport"
      | "getBalance"
      | "getDiscoveryReport"
      | "getRating"
      | "getSales"
      | "hasFreeTrial"
      | "hasRated"
      | "isAgent"
      | "rateReport"
      | "ratingDecimals"
      | "reportingCostInETH"
      | "reportingCostInUSD"
      | "reportingCostInUSDT"
      | "supportsInterface"
      | "usdPriceDecimals"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ReportDiscovery"
      | "ReportRated"
      | "ReportTaken"
      | "SalesClaimed"
  ): EventFragment;

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
    functionFragment: "getBalance",
    values: [AddressLike]
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
    functionFragment: "hasFreeTrial",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRated",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "isAgent",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rateReport",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "ratingDecimals",
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
    functionFragment: "usdPriceDecimals",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "buyReport", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "claimSales", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createReport",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getBalance", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getDiscoveryReport",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getRating", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "getSales", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hasFreeTrial",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasRated", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isAgent", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "rateReport", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ratingDecimals",
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
    functionFragment: "usdPriceDecimals",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
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

export interface IMissionBoard extends BaseContract {
  connect(runner?: ContractRunner | null): IMissionBoard;
  waitForDeployment(): Promise<this>;

  interface: IMissionBoardInterface;

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

  getBalance: TypedContractMethod<
    [account: AddressLike],
    [[bigint, bigint]],
    "view"
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

  hasFreeTrial: TypedContractMethod<[user: AddressLike], [boolean], "view">;

  hasRated: TypedContractMethod<
    [rater: AddressLike, reportId: BigNumberish],
    [boolean],
    "view"
  >;

  isAgent: TypedContractMethod<[account: AddressLike], [boolean], "view">;

  rateReport: TypedContractMethod<
    [reportId: BigNumberish, rating: BigNumberish],
    [void],
    "nonpayable"
  >;

  ratingDecimals: TypedContractMethod<[], [bigint], "view">;

  reportingCostInETH: TypedContractMethod<[], [[bigint, bigint]], "view">;

  reportingCostInUSD: TypedContractMethod<[], [[bigint, bigint]], "view">;

  reportingCostInUSDT: TypedContractMethod<[], [[bigint, bigint]], "view">;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
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
    nameOrSignature: "getBalance"
  ): TypedContractMethod<[account: AddressLike], [[bigint, bigint]], "view">;
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
    nameOrSignature: "hasFreeTrial"
  ): TypedContractMethod<[user: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "hasRated"
  ): TypedContractMethod<
    [rater: AddressLike, reportId: BigNumberish],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "isAgent"
  ): TypedContractMethod<[account: AddressLike], [boolean], "view">;
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

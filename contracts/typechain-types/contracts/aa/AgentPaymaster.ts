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

export type TransactionStruct = {
  txType: BigNumberish;
  from: BigNumberish;
  to: BigNumberish;
  gasLimit: BigNumberish;
  gasPerPubdataByteLimit: BigNumberish;
  maxFeePerGas: BigNumberish;
  maxPriorityFeePerGas: BigNumberish;
  paymaster: BigNumberish;
  nonce: BigNumberish;
  value: BigNumberish;
  reserved: [BigNumberish, BigNumberish, BigNumberish, BigNumberish];
  data: BytesLike;
  signature: BytesLike;
  factoryDeps: BytesLike[];
  paymasterInput: BytesLike;
  reservedDynamic: BytesLike;
};

export type TransactionStructOutput = [
  txType: bigint,
  from: bigint,
  to: bigint,
  gasLimit: bigint,
  gasPerPubdataByteLimit: bigint,
  maxFeePerGas: bigint,
  maxPriorityFeePerGas: bigint,
  paymaster: bigint,
  nonce: bigint,
  value: bigint,
  reserved: [bigint, bigint, bigint, bigint],
  data: string,
  signature: string,
  factoryDeps: string[],
  paymasterInput: string,
  reservedDynamic: string
] & {
  txType: bigint;
  from: bigint;
  to: bigint;
  gasLimit: bigint;
  gasPerPubdataByteLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymaster: bigint;
  nonce: bigint;
  value: bigint;
  reserved: [bigint, bigint, bigint, bigint];
  data: string;
  signature: string;
  factoryDeps: string[];
  paymasterInput: string;
  reservedDynamic: string;
};

export interface AgentPaymasterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "dailyTransactionCount"
      | "lastTransactionTimestamp"
      | "maxTransactionsPerDay"
      | "owner"
      | "postTransaction"
      | "renounceOwnership"
      | "setMaxTransactionsPerDay"
      | "transferOwnership"
      | "validateAndPayForPaymasterTransaction"
      | "withdraw"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;

  encodeFunctionData(
    functionFragment: "dailyTransactionCount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "lastTransactionTimestamp",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "maxTransactionsPerDay",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "postTransaction",
    values: [
      BytesLike,
      TransactionStruct,
      BytesLike,
      BytesLike,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxTransactionsPerDay",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "validateAndPayForPaymasterTransaction",
    values: [BytesLike, BytesLike, TransactionStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "dailyTransactionCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "lastTransactionTimestamp",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxTransactionsPerDay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "postTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxTransactionsPerDay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "validateAndPayForPaymasterTransaction",
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

export interface AgentPaymaster extends BaseContract {
  connect(runner?: ContractRunner | null): AgentPaymaster;
  waitForDeployment(): Promise<this>;

  interface: AgentPaymasterInterface;

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

  dailyTransactionCount: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  lastTransactionTimestamp: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  maxTransactionsPerDay: TypedContractMethod<[], [bigint], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  postTransaction: TypedContractMethod<
    [
      _context: BytesLike,
      _transaction: TransactionStruct,
      arg2: BytesLike,
      arg3: BytesLike,
      _txResult: BigNumberish,
      _maxRefundedGas: BigNumberish
    ],
    [void],
    "payable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setMaxTransactionsPerDay: TypedContractMethod<
    [_maxTransactionsPerDay: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  validateAndPayForPaymasterTransaction: TypedContractMethod<
    [arg0: BytesLike, arg1: BytesLike, _transaction: TransactionStruct],
    [[string, string] & { magic: string; context: string }],
    "payable"
  >;

  withdraw: TypedContractMethod<[_to: AddressLike], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "dailyTransactionCount"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "lastTransactionTimestamp"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxTransactionsPerDay"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "postTransaction"
  ): TypedContractMethod<
    [
      _context: BytesLike,
      _transaction: TransactionStruct,
      arg2: BytesLike,
      arg3: BytesLike,
      _txResult: BigNumberish,
      _maxRefundedGas: BigNumberish
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setMaxTransactionsPerDay"
  ): TypedContractMethod<
    [_maxTransactionsPerDay: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "validateAndPayForPaymasterTransaction"
  ): TypedContractMethod<
    [arg0: BytesLike, arg1: BytesLike, _transaction: TransactionStruct],
    [[string, string] & { magic: string; context: string }],
    "payable"
  >;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[_to: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
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
  };
}
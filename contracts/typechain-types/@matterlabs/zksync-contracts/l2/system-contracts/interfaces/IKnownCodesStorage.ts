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
} from "../../../../../common";

export interface IKnownCodesStorageInterface extends Interface {
  getFunction(
    nameOrSignature: "getMarker" | "markBytecodeAsPublished" | "markFactoryDeps"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "MarkedAsKnown"): EventFragment;

  encodeFunctionData(
    functionFragment: "getMarker",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "markBytecodeAsPublished",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "markFactoryDeps",
    values: [boolean, BytesLike[]]
  ): string;

  decodeFunctionResult(functionFragment: "getMarker", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "markBytecodeAsPublished",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "markFactoryDeps",
    data: BytesLike
  ): Result;
}

export namespace MarkedAsKnownEvent {
  export type InputTuple = [bytecodeHash: BytesLike, sendBytecodeToL1: boolean];
  export type OutputTuple = [bytecodeHash: string, sendBytecodeToL1: boolean];
  export interface OutputObject {
    bytecodeHash: string;
    sendBytecodeToL1: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IKnownCodesStorage extends BaseContract {
  connect(runner?: ContractRunner | null): IKnownCodesStorage;
  waitForDeployment(): Promise<this>;

  interface: IKnownCodesStorageInterface;

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

  getMarker: TypedContractMethod<[_hash: BytesLike], [bigint], "view">;

  markBytecodeAsPublished: TypedContractMethod<
    [
      _bytecodeHash: BytesLike,
      _l1PreimageHash: BytesLike,
      _l1PreimageBytesLen: BigNumberish
    ],
    [void],
    "nonpayable"
  >;

  markFactoryDeps: TypedContractMethod<
    [_shouldSendToL1: boolean, _hashes: BytesLike[]],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getMarker"
  ): TypedContractMethod<[_hash: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "markBytecodeAsPublished"
  ): TypedContractMethod<
    [
      _bytecodeHash: BytesLike,
      _l1PreimageHash: BytesLike,
      _l1PreimageBytesLen: BigNumberish
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "markFactoryDeps"
  ): TypedContractMethod<
    [_shouldSendToL1: boolean, _hashes: BytesLike[]],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "MarkedAsKnown"
  ): TypedContractEvent<
    MarkedAsKnownEvent.InputTuple,
    MarkedAsKnownEvent.OutputTuple,
    MarkedAsKnownEvent.OutputObject
  >;

  filters: {
    "MarkedAsKnown(bytes32,bool)": TypedContractEvent<
      MarkedAsKnownEvent.InputTuple,
      MarkedAsKnownEvent.OutputTuple,
      MarkedAsKnownEvent.OutputObject
    >;
    MarkedAsKnown: TypedContractEvent<
      MarkedAsKnownEvent.InputTuple,
      MarkedAsKnownEvent.OutputTuple,
      MarkedAsKnownEvent.OutputObject
    >;
  };
}
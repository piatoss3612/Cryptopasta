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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../../../../common";

export interface IAccountCodeStorageInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getCodeHash"
      | "getCodeSize"
      | "getRawCodeHash"
      | "markAccountCodeHashAsConstructed"
      | "storeAccountConstructedCodeHash"
      | "storeAccountConstructingCodeHash"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getCodeHash",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getCodeSize",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRawCodeHash",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "markAccountCodeHashAsConstructed",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "storeAccountConstructedCodeHash",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "storeAccountConstructingCodeHash",
    values: [AddressLike, BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "getCodeHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCodeSize",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRawCodeHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "markAccountCodeHashAsConstructed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "storeAccountConstructedCodeHash",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "storeAccountConstructingCodeHash",
    data: BytesLike
  ): Result;
}

export interface IAccountCodeStorage extends BaseContract {
  connect(runner?: ContractRunner | null): IAccountCodeStorage;
  waitForDeployment(): Promise<this>;

  interface: IAccountCodeStorageInterface;

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

  getCodeHash: TypedContractMethod<[_input: BigNumberish], [string], "view">;

  getCodeSize: TypedContractMethod<[_input: BigNumberish], [bigint], "view">;

  getRawCodeHash: TypedContractMethod<
    [_address: AddressLike],
    [string],
    "view"
  >;

  markAccountCodeHashAsConstructed: TypedContractMethod<
    [_address: AddressLike],
    [void],
    "nonpayable"
  >;

  storeAccountConstructedCodeHash: TypedContractMethod<
    [_address: AddressLike, _hash: BytesLike],
    [void],
    "nonpayable"
  >;

  storeAccountConstructingCodeHash: TypedContractMethod<
    [_address: AddressLike, _hash: BytesLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getCodeHash"
  ): TypedContractMethod<[_input: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getCodeSize"
  ): TypedContractMethod<[_input: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getRawCodeHash"
  ): TypedContractMethod<[_address: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "markAccountCodeHashAsConstructed"
  ): TypedContractMethod<[_address: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "storeAccountConstructedCodeHash"
  ): TypedContractMethod<
    [_address: AddressLike, _hash: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "storeAccountConstructingCodeHash"
  ): TypedContractMethod<
    [_address: AddressLike, _hash: BytesLike],
    [void],
    "nonpayable"
  >;

  filters: {};
}

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

export interface AgentRegistryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "AGENT_TOKEN"
      | "accountToAgent"
      | "accountToTokenId"
      | "addPortrait"
      | "agentToAccount"
      | "factory"
      | "isRegisteredAccount"
      | "isRegisteredAgent"
      | "owner"
      | "portrait"
      | "portraitCount"
      | "register"
      | "renounceOwnership"
      | "setFactory"
      | "supportsInterface"
      | "tokenIdToAccount"
      | "transferOwnership"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AgentRegistered"
      | "OwnershipTransferred"
      | "PortraitAdded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "AGENT_TOKEN",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "accountToAgent",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "accountToTokenId",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "addPortrait", values: [string]): string;
  encodeFunctionData(
    functionFragment: "agentToAccount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "factory", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isRegisteredAccount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegisteredAgent",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "portrait",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "portraitCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "register",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setFactory",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenIdToAccount",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "AGENT_TOKEN",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "accountToAgent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "accountToTokenId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addPortrait",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "agentToAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "factory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredAgent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "portrait", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "portraitCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setFactory", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenIdToAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
}

export namespace AgentRegisteredEvent {
  export type InputTuple = [
    agent: AddressLike,
    account: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [agent: string, account: string, tokenId: bigint];
  export interface OutputObject {
    agent: string;
    account: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
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

export namespace PortraitAddedEvent {
  export type InputTuple = [portraitId: BigNumberish, portrait: string];
  export type OutputTuple = [portraitId: bigint, portrait: string];
  export interface OutputObject {
    portraitId: bigint;
    portrait: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AgentRegistry extends BaseContract {
  connect(runner?: ContractRunner | null): AgentRegistry;
  waitForDeployment(): Promise<this>;

  interface: AgentRegistryInterface;

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

  AGENT_TOKEN: TypedContractMethod<[], [string], "view">;

  accountToAgent: TypedContractMethod<[account: AddressLike], [string], "view">;

  accountToTokenId: TypedContractMethod<
    [account: AddressLike],
    [bigint],
    "view"
  >;

  addPortrait: TypedContractMethod<[_portrait: string], [void], "nonpayable">;

  agentToAccount: TypedContractMethod<[agent: AddressLike], [string], "view">;

  factory: TypedContractMethod<[], [string], "view">;

  isRegisteredAccount: TypedContractMethod<
    [account: AddressLike],
    [boolean],
    "view"
  >;

  isRegisteredAgent: TypedContractMethod<
    [agent: AddressLike],
    [boolean],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  portrait: TypedContractMethod<[index: BigNumberish], [string], "view">;

  portraitCount: TypedContractMethod<[], [bigint], "view">;

  register: TypedContractMethod<
    [agent: AddressLike, portraitId: BigNumberish],
    [[string, bigint] & { account: string; tokenId: bigint }],
    "nonpayable"
  >;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  setFactory: TypedContractMethod<
    [_factory: AddressLike],
    [void],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  tokenIdToAccount: TypedContractMethod<
    [tokenId: BigNumberish],
    [string],
    "view"
  >;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "AGENT_TOKEN"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "accountToAgent"
  ): TypedContractMethod<[account: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "accountToTokenId"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "addPortrait"
  ): TypedContractMethod<[_portrait: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "agentToAccount"
  ): TypedContractMethod<[agent: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "factory"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "isRegisteredAccount"
  ): TypedContractMethod<[account: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isRegisteredAgent"
  ): TypedContractMethod<[agent: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "portrait"
  ): TypedContractMethod<[index: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "portraitCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "register"
  ): TypedContractMethod<
    [agent: AddressLike, portraitId: BigNumberish],
    [[string, bigint] & { account: string; tokenId: bigint }],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setFactory"
  ): TypedContractMethod<[_factory: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "tokenIdToAccount"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;

  getEvent(
    key: "AgentRegistered"
  ): TypedContractEvent<
    AgentRegisteredEvent.InputTuple,
    AgentRegisteredEvent.OutputTuple,
    AgentRegisteredEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;
  getEvent(
    key: "PortraitAdded"
  ): TypedContractEvent<
    PortraitAddedEvent.InputTuple,
    PortraitAddedEvent.OutputTuple,
    PortraitAddedEvent.OutputObject
  >;

  filters: {
    "AgentRegistered(address,address,uint256)": TypedContractEvent<
      AgentRegisteredEvent.InputTuple,
      AgentRegisteredEvent.OutputTuple,
      AgentRegisteredEvent.OutputObject
    >;
    AgentRegistered: TypedContractEvent<
      AgentRegisteredEvent.InputTuple,
      AgentRegisteredEvent.OutputTuple,
      AgentRegisteredEvent.OutputObject
    >;

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

    "PortraitAdded(uint256,string)": TypedContractEvent<
      PortraitAddedEvent.InputTuple,
      PortraitAddedEvent.OutputTuple,
      PortraitAddedEvent.OutputObject
    >;
    PortraitAdded: TypedContractEvent<
      PortraitAddedEvent.InputTuple,
      PortraitAddedEvent.OutputTuple,
      PortraitAddedEvent.OutputObject
    >;
  };
}

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

export interface IAgentRegistryInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "accountToAgent"
      | "accountToTokenId"
      | "addPortrait"
      | "agentToAccount"
      | "isRegisteredAccount"
      | "isRegisteredAgent"
      | "portrait"
      | "portraitCount"
      | "register"
      | "supportsInterface"
      | "tokenIdToAccount"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "AgentRegistered" | "PortraitAdded"
  ): EventFragment;

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
  encodeFunctionData(
    functionFragment: "isRegisteredAccount",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isRegisteredAgent",
    values: [AddressLike]
  ): string;
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
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenIdToAccount",
    values: [BigNumberish]
  ): string;

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
  decodeFunctionResult(
    functionFragment: "isRegisteredAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRegisteredAgent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "portrait", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "portraitCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "register", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokenIdToAccount",
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

export interface IAgentRegistry extends BaseContract {
  connect(runner?: ContractRunner | null): IAgentRegistry;
  waitForDeployment(): Promise<this>;

  interface: IAgentRegistryInterface;

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

  accountToAgent: TypedContractMethod<[account: AddressLike], [string], "view">;

  accountToTokenId: TypedContractMethod<
    [account: AddressLike],
    [bigint],
    "view"
  >;

  addPortrait: TypedContractMethod<[portrait: string], [void], "nonpayable">;

  agentToAccount: TypedContractMethod<[agent: AddressLike], [string], "view">;

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

  portrait: TypedContractMethod<[index: BigNumberish], [string], "view">;

  portraitCount: TypedContractMethod<[], [bigint], "view">;

  register: TypedContractMethod<
    [agent: AddressLike, portraitId: BigNumberish],
    [[string, bigint] & { account: string; tokenId: bigint }],
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

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "accountToAgent"
  ): TypedContractMethod<[account: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "accountToTokenId"
  ): TypedContractMethod<[account: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "addPortrait"
  ): TypedContractMethod<[portrait: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "agentToAccount"
  ): TypedContractMethod<[agent: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "isRegisteredAccount"
  ): TypedContractMethod<[account: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isRegisteredAgent"
  ): TypedContractMethod<[agent: AddressLike], [boolean], "view">;
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
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "tokenIdToAccount"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  getEvent(
    key: "AgentRegistered"
  ): TypedContractEvent<
    AgentRegisteredEvent.InputTuple,
    AgentRegisteredEvent.OutputTuple,
    AgentRegisteredEvent.OutputObject
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
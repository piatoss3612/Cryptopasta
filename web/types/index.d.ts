import { Abi, Account, Address } from "viem";

interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}

interface TransactionRequest {
  from: Account | Address;
  to: Address;
  abi?: Abi;
  functionName?: string;
  args?: any[];
  value?: bigint;
  gas?: bigint;
  isMulticall?: boolean;
  multicallData?: string;
  paymaster?: Account | Address;
  paymasterInput?: `0x${string}`;
  gasPerPubdata?: bigint;
}

interface PaymasterParams {
  paymaster: Account | Address;
  paymasterInput: `0x${string}`;
  gasPerPubdata: bigint;
}

interface PinResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

enum PaymentMethod {
  ETH,
  USDT,
}

interface Report {
  id: string;
  reportId: string;
  reporter: string;
  priceInUSD: string;
  title: string;
  contentURI: string;
  blockTimestamp: string;
}

interface SingleReport {
  reportDiscovery: Report;
}

interface ReportList {
  reportDiscoveries: Report[];
}

interface CryptopastaList {
  transferSingles: [{ cryptopasta_id: string }];
}

interface Message {
  id?: string;
  content: string;
  isUser: boolean;
  isReport?: boolean;
  isImage?: boolean;
  isTyping?: boolean;
}

interface Entry {
  id: string;
  missionID: string;
  messages: Message[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface Mission {
  id: string;
  title: string;
  agentID: string;
  reportID: string;
  createdAt: string;
  isNew?: boolean;
}

type Missions = Mission[];

interface GetMissionsRequest {
  agent_id: string;
  last_mission_id?: string;
  limit?: number;
}

interface GetMissionsResponse {
  missions: Missions;
  cursor?: string;
}

interface GetEntriesResponse {
  missionID: string;
  entries: Entry[];
}

interface CreateMissionRequest {
  agent_id: string;
  report_id: string;
}

interface ActOnMissionRequest {
  input: string;
}

interface ActOnMissionResponse {
  entryID: string;
  imageB64JSON: string;
}

export type {
  TokenMetadata,
  TransactionRequest,
  PaymasterParams,
  PaymentMethod,
  PinResponse,
  Report,
  ReportList,
  SingleReport,
  Message,
  Entry,
  Mission,
  Missions,
  CryptopastaList,
  GetMissionsRequest,
  GetMissionsResponse,
  GetEntriesResponse,
  CreateMissionRequest,
  ActOnMissionRequest,
  ActOnMissionResponse,
};

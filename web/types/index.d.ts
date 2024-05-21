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

interface ChatHistoryItem {
  id: number;
  title: string;
}

type ChatHistory = ChatHistoryItem[];

interface Message {
  id?: string;
  content: string;
  isUser: boolean;
  image?: string;
  isTyping?: boolean;
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
  ChatHistoryItem,
  ChatHistory,
  Message,
};

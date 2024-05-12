import { Abi, Account, Address } from "viem";

interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}

interface WriteContractParams {
  account: Account | Address;
  address: Address;
  abi: Abi;
  functionName: string;
  args?: any[];
  value?: bigint;
  gas?: bigint;
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

export type {
  TokenMetadata,
  WriteContractParams,
  PaymasterParams,
  PaymentMethod,
  PinResponse,
};

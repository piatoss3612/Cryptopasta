import { encodeAbiParameters, encodePacked, fromHex, zeroAddress } from "viem";
import {
  AGENT_PAYMASTER,
  MISSION_LOG,
  MOCK_USDT,
  MULTICALL_SELECTOR,
} from "../constant";
import { MissionLogAbi, MockUSDTAbi } from "../abis";
import { TransactionRequest } from "../../types";

const loadImage = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

const isZeroAddress = (address: string | undefined): boolean => {
  return address === zeroAddress;
};

const abbreviateAddress = (address: string | undefined, length = 4): string => {
  if (!address) {
    address = zeroAddress;
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};

const getFaucetParams = (account: `0x${string}`): TransactionRequest => {
  const params = {
    from: account as `0x${string}`,
    to: MOCK_USDT as `0x${string}`,
    abi: MockUSDTAbi,
    functionName: "faucet",
    gas: BigInt(10000000), // estimateGas on aa account is just not working, so we have to set it manually
  } as TransactionRequest;

  return params;
};

const getPaymasterApprovalParams = (
  account: `0x${string}`
): TransactionRequest => {
  const params = {
    from: account as `0x${string}`,
    to: MOCK_USDT as `0x${string}`,
    abi: MockUSDTAbi,
    functionName: "approve",
    args: [
      AGENT_PAYMASTER,
      fromHex(
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        "bigint"
      ),
    ], // max uint256 value
    gas: BigInt(10000000), // estimateGas on aa account is just not working, so we have to set it manually
  } as TransactionRequest;

  return params;
};

const getMissionLogMintParams = (
  account: `0x${string}`,
  uri: string
): TransactionRequest => {
  return {
    from: account as `0x${string}`,
    to: MISSION_LOG as `0x${string}`,
    abi: MissionLogAbi,
    functionName: "mint",
    args: [uri],
    gas: BigInt(10000000), // estimateGas on aa account is just not working, so we have to set it manually
  } as TransactionRequest;
};

const encodeMulticalldata = (
  targets: `0x${string}`[],
  calldatas: `0x${string}`[],
  values: bigint[]
): `0x${string}` => {
  const encodedParams = encodeAbiParameters(
    [
      { name: "targets", type: "address[]" },
      { name: "calldatas", type: "bytes[]" },
      { name: "values", type: "uint256[]" },
    ],
    [targets, calldatas, values]
  );

  return encodePacked(["bytes4", "bytes"], [MULTICALL_SELECTOR, encodedParams]);
};

export {
  loadImage,
  isZeroAddress,
  abbreviateAddress,
  getFaucetParams,
  getPaymasterApprovalParams,
  getMissionLogMintParams,
  encodeMulticalldata,
};

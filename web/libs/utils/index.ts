import { encodeAbiParameters, encodePacked, zeroAddress } from "viem";
import { MOCK_USDT, MULTICALL_SELECTOR } from "../constant";
import { MockUSDTAbi } from "../abis";
import { TransactionRequest } from "../types";

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
    gas: BigInt(1000000), // estimateGas on aa account is just not working, so we have to set it manually
  } as TransactionRequest;

  return params;
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
  isZeroAddress,
  abbreviateAddress,
  getFaucetParams,
  encodeMulticalldata,
};

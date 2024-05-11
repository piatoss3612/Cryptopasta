import { zeroAddress } from "viem";
import { MOCK_USDT } from "../constant";
import { MockUSDTAbi } from "../abis";
import { WriteContractParams } from "../types";

const isZeroAddress = (address: string | undefined): boolean => {
  return address === zeroAddress;
};

const abbreviateAddress = (address: string | undefined, length = 4): string => {
  if (!address) {
    address = zeroAddress;
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};

const getFaucetParams = (account: `0x${string}`): WriteContractParams => {
  const params = {
    account: account as `0x${string}`,
    address: MOCK_USDT as `0x${string}`,
    abi: MockUSDTAbi,
    functionName: "faucet",
    gas: BigInt(350000), // estimateGas on aa account is just not working, so we have to set it manually
  } as WriteContractParams;

  return params;
};

export { isZeroAddress, abbreviateAddress, getFaucetParams };

import { zeroAddress } from "viem";

const isZeroAddress = (address: string): boolean => {
  return address === zeroAddress;
};

const abbreviateAddress = (address: string | undefined, length = 4): string => {
  if (!address) {
    address = zeroAddress;
  }

  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};

export { isZeroAddress, abbreviateAddress };

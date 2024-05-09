import { zeroAddress } from "viem";

const isZeroAddress = (address: string): boolean => {
  return address === zeroAddress;
};

const abbreviateAddress = (address: string | undefined, length = 6): string => {
  if (!address) {
    address = zeroAddress;
  }

  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

export { isZeroAddress, abbreviateAddress };

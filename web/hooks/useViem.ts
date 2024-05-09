import { createPublicClient, http } from "viem";
import { zkSyncSepoliaTestnet } from "viem/chains";

const useViem = () => {
  // public client for reading data from the blockchain
  const client = createPublicClient({
    chain: zkSyncSepoliaTestnet,
    transport: http(),
  });

  return { client };
};

export default useViem;

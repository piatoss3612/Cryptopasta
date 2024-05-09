import { createPublicClient, http } from "viem";
import { zkSyncSepoliaTestnet } from "viem/chains";

const useViem = () => {
  const client = createPublicClient({
    chain: zkSyncSepoliaTestnet,
    transport: http(),
  });

  return { client };
};

export default useViem;

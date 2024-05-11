import { WriteContractParams } from "@/libs/types";
import {
  PrepareTransactionRequestReturnType,
  createPublicClient,
  http,
} from "viem";
import { zkSyncSepoliaTestnet } from "viem/chains";

const useViem = () => {
  // public client for reading data from the blockchain
  const client = createPublicClient({
    chain: zkSyncSepoliaTestnet,
    transport: http(),
  });

  const getGasPrice = async (): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.getGasPrice();
  };

  const estimateGas = async (params: WriteContractParams): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.estimateGas(params);
  };

  return { client, getGasPrice, estimateGas };
};

export default useViem;

import { PriceConverterAbi } from "@/libs/abis";
import { PRICE_CONVERTER } from "@/libs/constant";
import {
  PrepareTransactionRequestRequest,
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

  const estimateGas = async (
    params: PrepareTransactionRequestRequest
  ): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.estimateGas(params);
  };

  const getUsdPriceInETH = async (usdAmount: bigint) => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.readContract({
      address: PRICE_CONVERTER,
      abi: PriceConverterAbi,
      functionName: "convertUSDToNativeAsset",
      args: [usdAmount],
    });
  };

  const getUsdPriceInUSDT = async (usdAmount: bigint) => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.readContract({
      address: PRICE_CONVERTER,
      abi: PriceConverterAbi,
      functionName: "convertUSDToUSDT",
      args: [usdAmount],
    });
  };

  return {
    client,
    getGasPrice,
    estimateGas,
    getUsdPriceInETH,
    getUsdPriceInUSDT,
  };
};

export default useViem;

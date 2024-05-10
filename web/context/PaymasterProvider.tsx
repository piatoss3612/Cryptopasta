import { useViem } from "@/hooks";
import { AgentPaymasterAbi } from "@/libs/abis";
import { AGENT_PAYMASTER } from "@/libs/constant";
import { createContext } from "react";
import { getGeneralPaymasterInput } from "viem/zksync";

interface PaymasterContextProps {
  getMaxTxsPerDay: () => Promise<bigint>;
  getDailyTxCount: (address: `0x${string}`) => Promise<bigint>;
  getLastTxTimestamp: (address: `0x${string}`) => Promise<bigint>;
  getPaymasterParams: () => PaymasterParams;
  canResetDailyTxCount: (address: `0x${string}`) => Promise<boolean>;
}

interface PaymasterParams {
  paymaster: string;
  paymasterInput: string;
  gasPerPubdata: bigint;
}

const PaymasterContext = createContext({} as PaymasterContextProps);

const PaymasterProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useViem();

  const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50000;

  const getMaxTxsPerDay = async (): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.readContract({
      address: AGENT_PAYMASTER,
      abi: AgentPaymasterAbi,
      functionName: "MAX_TRANSACTIONS_PER_DAY",
    });
  };

  const getDailyTxCount = async (address: `0x${string}`): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.readContract({
      address: AGENT_PAYMASTER,
      abi: AgentPaymasterAbi,
      functionName: "dailyTransactionCount",
      args: [address],
    });
  };

  const getLastTxTimestamp = async (
    address: `0x${string}`
  ): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.readContract({
      address: AGENT_PAYMASTER,
      abi: AgentPaymasterAbi,
      functionName: "lastTransactionTimestamp",
      args: [address],
    });
  };

  // lastTimestamp is unix timestamp in seconds
  const canResetDailyTxCount = async (
    address: `0x${string}`
  ): Promise<boolean> => {
    const lastTimestamp = await getLastTxTimestamp(address);

    // reset on UTC 6 am
    const today6AM =
      new Date(new Date().toUTCString()).setUTCHours(6, 0, 0, 0) / 1000;
    return (
      lastTimestamp < BigInt(today6AM) &&
      BigInt(today6AM) < BigInt(Date.now() / 1000)
    );
  };

  const getPaymasterParams = (): PaymasterParams => {
    const params = getGeneralPaymasterInput({
      innerInput: "0x",
    });

    return {
      paymaster: AGENT_PAYMASTER,
      paymasterInput: params,
      gasPerPubdata: BigInt(DEFAULT_GAS_PER_PUBDATA_LIMIT),
    };
  };

  return (
    <PaymasterContext.Provider
      value={{
        getMaxTxsPerDay,
        getDailyTxCount,
        getLastTxTimestamp,
        getPaymasterParams,
        canResetDailyTxCount,
      }}
    >
      {children}
    </PaymasterContext.Provider>
  );
};

export { PaymasterContext, PaymasterProvider };

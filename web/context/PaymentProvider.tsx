import PaymentModal from "@/components/payment/PaymentModal";
import { useAgent, useViem } from "@/hooks";
import { AgentPaymasterAbi, MockUSDTAbi } from "@/libs/abis";
import { AGENT_PAYMASTER, MOCK_USDT } from "@/libs/constant";
import { PaymasterParams, TransactionRequest } from "@/types";
import { isZeroAddress } from "@/libs/utils";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { encodeFunctionData, formatEther } from "viem";
import {
  getApprovalBasedPaymasterInput,
  getGeneralPaymasterInput,
  zkSyncSepoliaTestnet,
} from "viem/zksync";

interface PaymentContextProps {
  onOpenPayment: (
    name: string,
    request: TransactionRequest,
    callback?: () => void
  ) => void;
  getMaxTxsPerDay: () => Promise<bigint>;
  getDailyTxCount: (address: `0x${string}`) => Promise<bigint>;
  getLastTxTimestamp: (address: `0x${string}`) => Promise<bigint>;
  canResetDailyTxCount: (lastTimestamp: bigint) => boolean;
  getPaymasterParams: () => PaymasterParams;
}

const PaymentContext = createContext({} as PaymentContextProps);

const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50000;

  const toast = useToast();
  const { client, getGasPrice, estimateGas } = useViem();
  const { walletClient, account } = useAgent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requestName, setRequestName] = useState<string>("");
  const [useApproval, setUseApproval] = useState<boolean>(false);
  const [txRequest, setTxRequest] = useState<TransactionRequest | null>(null);
  const [callback, setCallback] = useState<() => void>(() => () => {});
  const [txStatus, setTxStatus] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const getUSDTAllowance = async (): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    if (!account) {
      throw new Error("Account not initialized");
    }

    return await client.readContract({
      address: MOCK_USDT,
      abi: MockUSDTAbi,
      functionName: "allowance",
      args: [account, AGENT_PAYMASTER],
    });
  };

  const toggleUseApproval = () => {
    setUseApproval((prev) => !prev);
  };

  const { data: gasEstimate } = useQuery({
    queryKey: ["estimateGas"],
    queryFn: async () => await estimateGas(txRequest!),
    enabled: !!txRequest,
  });

  const { data: gasPrice } = useQuery({
    queryKey: ["getGasPrice"],
    queryFn: async () => await getGasPrice(),
    enabled: !!client,
  });

  const { data: usdtAllowance } = useQuery({
    queryKey: ["usdtAllowance"],
    queryFn: getUSDTAllowance,
    enabled: !!client && !!account,
  });

  const gasEstimateInETH = formatEther(gasEstimate || BigInt(200000));
  const gasPriceInETH = formatEther(gasPrice || BigInt(200000));
  const totalCostInETH = formatEther(
    (gasEstimate || BigInt(200000)) * (gasPrice || BigInt(200000))
  );
  const usdtAllowanceValue = usdtAllowance
    ? (usdtAllowance / BigInt(10 ** 6)).toString()
    : "0";

  const onOpenPayment = async (
    name: string,
    request: TransactionRequest,
    callback?: () => void
  ) => {
    setRequestName(name);
    setTxRequest(request);
    setCallback(() => callback || (() => {}));
    onOpen();
  };

  const onClosePayment = () => {
    const cb = callback;

    setRequestName("");
    setTxRequest(null);
    setUseApproval(false);
    setTxHash("");
    setTxStatus("");
    setCallback(() => {});
    onClose();

    if (txStatus === "success") {
      cb();
    }
  };

  const getMaxTxsPerDay = async (): Promise<bigint> => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    return await client.readContract({
      address: AGENT_PAYMASTER,
      abi: AgentPaymasterAbi,
      functionName: "maxTransactionsPerDay",
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
  const canResetDailyTxCount = (lastTimestamp: bigint): boolean => {
    // reset on UTC 6 am
    const today6AM =
      new Date(new Date().toUTCString()).setUTCHours(6, 0, 0, 0) / 1000;
    return (
      lastTimestamp < BigInt(today6AM) &&
      BigInt(today6AM) < BigInt(Math.floor(Date.now() / 1000))
    );
  };

  const { data: maxTxsPerDay } = useQuery({
    queryKey: ["maxTxsPerDay"],
    queryFn: getMaxTxsPerDay,
    enabled: !!client,
  });

  const maxTxsPerDayValue = maxTxsPerDay || BigInt(5);

  const { data: dailyTxCount } = useQuery({
    queryKey: ["dailyTxCount"],
    queryFn: async () => await getDailyTxCount(account!),
    enabled: !!client && !!account,
  });

  const dailyTxCountValue = dailyTxCount || BigInt(0);

  const { data: lastTxTimestamp } = useQuery({
    queryKey: ["lastTxTimestamp"],
    queryFn: async () => await getLastTxTimestamp(account!),
    enabled: !!client && !!account,
  });

  const lastTxTimestampValue = lastTxTimestamp || BigInt(0);
  const canResetDailyTxCountValue = canResetDailyTxCount(lastTxTimestampValue);
  const canUsePaymaster =
    dailyTxCountValue.valueOf() < maxTxsPerDayValue.valueOf() ||
    canResetDailyTxCountValue;

  const getPaymasterParams = (): PaymasterParams => {
    let input: `0x${string}`;

    if (useApproval) {
      input = getApprovalBasedPaymasterInput({
        token: MOCK_USDT,
        minAllowance: BigInt(0),
        innerInput: "0x",
      });
    } else {
      input = getGeneralPaymasterInput({
        innerInput: "0x",
      });
    }

    console.log("input", input);

    return {
      paymaster: AGENT_PAYMASTER as `0x${string}`,
      paymasterInput: input,
      gasPerPubdata: BigInt(DEFAULT_GAS_PER_PUBDATA_LIMIT) + BigInt(30000),
    };
  };

  const confirmPayment = async () => {
    if (!client) {
      throw new Error("Client not initialized");
    }

    if (!walletClient) {
      throw new Error("Wallet not initialized");
    }

    if (isZeroAddress(account)) {
      throw new Error("Account not initialized");
    }

    if (!txRequest) {
      throw new Error("Transaction request not initialized");
    }

    try {
      setIsLoading(true);

      const request = txRequest;

      let data: `0x${string}` = "0x";

      // If it's a multicall request, use the multicall data
      // Otherwise, encode the function data
      if (request.isMulticall) {
        data = request.multicallData as `0x${string}`;
      } else {
        data = encodeFunctionData({
          abi: txRequest.abi!,
          functionName: txRequest.functionName,
          args: txRequest.args,
        });
      }

      const paymasterParams = getPaymasterParams();
      request.paymaster = paymasterParams.paymaster;
      request.paymasterInput = paymasterParams.paymasterInput;
      request.gasPerPubdata = paymasterParams.gasPerPubdata;

      const hash = await walletClient.sendTransaction({
        account: request.from,
        to: request.to,
        data: data,
        value: request.value || BigInt(0),
        chain: zkSyncSepoliaTestnet,
        gas: request.gas || BigInt(2000000),
        maxPriorityFeePerGas: BigInt(1000000),
        paymaster: request.paymaster,
        paymasterInput: request.paymasterInput,
        gasPerPubdata: request.gasPerPubdata,
      });

      const receipt = await client.waitForTransactionReceipt({
        hash,
      });

      setTxStatus(receipt.status);
      setTxHash(hash);
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        onOpenPayment,
        getMaxTxsPerDay,
        getDailyTxCount,
        getLastTxTimestamp,
        canResetDailyTxCount,
        getPaymasterParams,
      }}
    >
      <PaymentModal
        onClose={onClosePayment}
        isOpen={isOpen}
        isLoading={isLoading}
        useApproval={useApproval}
        toggleUseApproval={toggleUseApproval}
        allowanceAmount={usdtAllowanceValue}
        txHash={txHash}
        requestName={requestName}
        gasEstimateInETH={gasEstimateInETH}
        gasPriceInETH={gasPriceInETH}
        dailyTxCount={dailyTxCountValue.toString()}
        maxTxsPerDay={maxTxsPerDayValue.toString()}
        canResetDailyTxCount={canResetDailyTxCountValue}
        totalCostInETH={totalCostInETH}
        canUsePaymaster={canUsePaymaster}
        txStatus={txStatus}
        confirmPayment={confirmPayment}
      />
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentContext, PaymentProvider };

import { useAgent, useViem } from "@/hooks";
import { AgentPaymasterAbi } from "@/libs/abis";
import { AGENT_PAYMASTER } from "@/libs/constant";
import { PaymasterParams, TransactionRequest } from "@/libs/types";
import { isZeroAddress } from "@/libs/utils";
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  SmallCloseIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  Divider,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { encodeFunctionData, formatEther } from "viem";
import { getGeneralPaymasterInput, zkSyncSepoliaTestnet } from "viem/zksync";

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
  const [txRequest, setTxRequest] = useState<TransactionRequest | null>(null);
  const [callback, setCallback] = useState<() => void>(() => () => {});
  const [txStatus, setTxStatus] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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

  const gasEstimateInETH = formatEther(gasEstimate || BigInt(200000));
  const gasPriceInETH = formatEther(gasPrice || BigInt(200000));
  const totalCostInETH = formatEther(
    (gasEstimate || BigInt(200000)) * (gasPrice || BigInt(200000))
  );

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
    if (txStatus !== "success") {
      onClose();
      return;
    }

    const cb = callback;

    setTxRequest(null);
    setTxHash("");
    setTxStatus("");
    setCallback(() => {});
    onClose();
    cb();
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
    const params = getGeneralPaymasterInput({
      innerInput: "0x",
    });

    return {
      paymaster: AGENT_PAYMASTER as `0x${string}`,
      paymasterInput: params,
      gasPerPubdata: BigInt(DEFAULT_GAS_PER_PUBDATA_LIMIT) + BigInt(80000),
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

  const Line = ({
    left,
    right,
  }: {
    left: string | JSX.Element;
    right: string | JSX.Element;
  }): JSX.Element => (
    <HStack spacing={4} justify="space-between" w={"100%"}>
      <Text fontSize={"lg"}>{left}</Text>
      <Text fontSize={"lg"}>{right}</Text>
    </HStack>
  );

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
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={{ base: "md", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Payment Details</ModalHeader>
          <ModalCloseButton onClick={onClosePayment} />
          {isLoading && (
            <ModalBody>
              <Center m={12}>
                <Stack spacing={8} justify="center" align="center">
                  <Spinner thickness="4px" size="lg" />
                  <Text>Processing...</Text>
                </Stack>
              </Center>
            </ModalBody>
          )}
          {!isLoading && !txHash && (
            <>
              <ModalBody bg={"gray.100"} mx={6} rounded={"md"}>
                <Stack m={4} spacing={4} justify="center" align="center">
                  <Line left="Transaction:" right={requestName} />
                  <Line
                    left="Transaction Fee:"
                    right={`${gasEstimateInETH} ETH`}
                  />
                  <Line left="Gas Price:" right={`${gasPriceInETH} ETH`} />

                  <Line
                    left="Paymaster Limit:"
                    right={`${dailyTxCountValue.toString()}/${maxTxsPerDayValue.toString()}`}
                  />
                  <Line
                    left="Can Reset Limit:"
                    right={
                      canResetDailyTxCountValue ? (
                        <CheckCircleIcon color="green" />
                      ) : (
                        <SmallCloseIcon color="red" />
                      )
                    }
                  />

                  <Divider />
                  <Line
                    left="Estimated Cost:"
                    right={`${totalCostInETH} ETH`}
                  />
                  <Line
                    left="Paymaster Discount:"
                    right={`- ${totalCostInETH} ETH`}
                  />
                  <Divider />
                  <Line
                    left="Total Cost:"
                    right={`${canUsePaymaster ? "0" : totalCostInETH} ETH`}
                  />
                </Stack>
              </ModalBody>
              <ModalFooter display="flex" justifyContent="center">
                <Button
                  colorScheme="green"
                  onClick={confirmPayment}
                  width={"100%"}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
          {!isLoading && txHash && (
            <>
              <ModalBody>
                <Center m={4}>
                  <Stack spacing={4} justify="center" align="center">
                    {txStatus === "success" ? (
                      <>
                        <CheckCircleIcon
                          name="check-circle"
                          color="green.500"
                          boxSize={"2.4rem"}
                        />
                        <Text>Transaction Succeeded</Text>
                      </>
                    ) : (
                      <>
                        <WarningIcon
                          name="warning"
                          color="red.500"
                          boxSize={"2.4rem"}
                        />
                        <Text>Transaction Reverted</Text>
                      </>
                    )}

                    <Link
                      href={`https://sepolia.explorer.zksync.io/tx/${txHash}`}
                      isExternal
                    >
                      See on Explorer <ExternalLinkIcon mx="2px" />
                    </Link>
                  </Stack>
                </Center>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={onClosePayment}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentContext, PaymentProvider };

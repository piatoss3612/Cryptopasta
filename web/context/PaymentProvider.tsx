import { useAgent, useViem } from "@/hooks";
import { AgentPaymasterAbi } from "@/libs/abis";
import { AGENT_PAYMASTER } from "@/libs/constant";
import { PaymasterParams, WriteContractParams } from "@/libs/types";
import { isZeroAddress } from "@/libs/utils";
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import {
  Button,
  Center,
  Checkbox,
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
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";
import { formatEther } from "viem";
import { eip712WalletActions, getGeneralPaymasterInput } from "viem/zksync";

interface PaymentContextProps {
  onOpenPayment: (name: string, params: WriteContractParams) => void;
  getMaxTxsPerDay: () => Promise<bigint>;
  getDailyTxCount: (address: `0x${string}`) => Promise<bigint>;
  getLastTxTimestamp: (address: `0x${string}`) => Promise<bigint>;
  canResetDailyTxCount: (lastTimestamp: bigint) => boolean;
  getPaymasterParams: () => PaymasterParams;
}

const PaymentContext = createContext({} as PaymentContextProps);

const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const DEFAULT_GAS_PER_PUBDATA_LIMIT = 50000;

  const { client, getGasPrice, estimateGas } = useViem();
  const { walletClient, account } = useAgent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requestName, setRequestName] = useState<string>("");
  const [txRequest, setTxRequest] = useState<WriteContractParams | null>(null);
  const [txHash, setTxHash] = useState<string>("");
  const [requirePaymaster, setRequirePaymaster] = useState<boolean>(false);
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

  const onOpenPayment = async (name: string, params: WriteContractParams) => {
    setRequestName(name);
    setTxRequest(params);
    onOpen();
  };

  const onClosePayment = () => {
    setTxRequest(null);
    setRequirePaymaster(false);
    setTxHash("");
    onClose();
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

  const getPaymasterParams = (): PaymasterParams => {
    const params = getGeneralPaymasterInput({
      innerInput: "0x",
    });

    return {
      paymaster: AGENT_PAYMASTER as `0x${string}`,
      paymasterInput: params,
      gasPerPubdata: BigInt(DEFAULT_GAS_PER_PUBDATA_LIMIT),
    };
  };

  const confirmPayment = async () => {
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

      const zkClient = walletClient.extend(eip712WalletActions());

      const request = { ...txRequest };

      if (requirePaymaster) {
        const paymasterParams = getPaymasterParams();
        request.paymaster = paymasterParams.paymaster;
        request.paymasterInput = paymasterParams.paymasterInput;
        request.gasPerPubdata = paymasterParams.gasPerPubdata;
      }

      const hash = await zkClient.writeContract(request);
      setTxHash(hash);
    } catch (error) {
      console.error(error);
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
                  <Checkbox
                    p={2}
                    borderRadius={"md"}
                    bg={"blue.500"}
                    color={"white"}
                    fontSize={"lg"}
                    fontWeight={"bold"}
                    isChecked={requirePaymaster}
                    isDisabled={
                      dailyTxCountValue >= maxTxsPerDayValue &&
                      !canResetDailyTxCountValue
                    }
                    onChange={(e) => setRequirePaymaster(e.target.checked)}
                  >
                    Use Paymaster
                  </Checkbox>
                  <Divider />
                  <Line
                    left="Estimated Cost:"
                    right={`${totalCostInETH} ETH`}
                  />
                  {requirePaymaster && (
                    <Line
                      left="Paymaster Discount:"
                      right={`- ${totalCostInETH} ETH`}
                    />
                  )}
                  <Divider />
                  <Line
                    left="Total Cost:"
                    right={`${requirePaymaster ? "0" : totalCostInETH} ETH`}
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
                    <CheckCircleIcon
                      name="check-circle"
                      color="green.500"
                      boxSize={"2.4rem"}
                    />
                    <Text>Transaction sent</Text>
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

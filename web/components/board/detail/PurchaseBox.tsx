import React, { useState } from "react";
import {
  Flex,
  Text,
  Stack,
  Button,
  HStack,
  RadioGroup,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { useAgent, usePayment, useViem } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { encodeFunctionData, formatEther, formatUnits } from "viem";
import { PaymentMethod, TransactionRequest } from "@/types";
import { MISSION_BOARD, MOCK_USDT } from "@/libs/constant";
import { MissionBoardAbi, MockUSDTAbi } from "@/libs/abis";
import { encodeMulticalldata, isZeroAddress } from "@/libs/utils";
import InfoLine from "./InfoLine";

interface PurchaseBoxProps {
  reportId: string;
  priceInUSD: string;
}

const PurchaseBox = ({ reportId, priceInUSD }: PurchaseBoxProps) => {
  const toast = useToast();
  const { getUsdPriceInETH, getUsdPriceInUSDT } = useViem();
  const { account } = useAgent();
  const { onOpenPayment } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(0);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(parseInt(value));
  };

  const priceInUSDValue = formatUnits(BigInt(priceInUSD), 6);

  const { data: priceInETH } = useQuery({
    queryKey: ["priceInETH", priceInUSD],
    queryFn: async () => {
      return await getUsdPriceInETH(BigInt(priceInUSD));
    },
    refetchInterval: 3000,
  });

  const { data: priceInUSDT } = useQuery({
    queryKey: ["priceInUSDT", priceInUSD],
    queryFn: async () => {
      return await getUsdPriceInUSDT(BigInt(priceInUSD));
    },
    refetchInterval: 3000,
  });

  const priceInETHValue = priceInETH ? formatEther(priceInETH) : 0;
  const priceInUSDTValue = priceInUSDT ? formatUnits(priceInUSDT, 6) : 0;

  const handlePurchase = async () => {
    try {
      if (isZeroAddress(account)) {
        throw new Error("Account is not connected");
      }

      let params: TransactionRequest;

      if (paymentMethod === 0) {
        if (priceInETH === undefined) {
          throw new Error("Price in ETH is not available");
        }

        params = {
          from: account as `0x${string}`,
          to: MISSION_BOARD as `0x${string}`,
          abi: MissionBoardAbi,
          functionName: "buyReport",
          args: [BigInt(reportId), 0],
          gas: BigInt(10000000),
          value: BigInt(priceInETH),
        };
      } else if (paymentMethod === 1) {
        if (priceInUSDT === undefined) {
          throw new Error("Price in USDT is not available");
        }

        // 1. approve USDT to MissionBoard
        const approveData = encodeFunctionData({
          abi: MockUSDTAbi,
          functionName: "approve",
          args: [MISSION_BOARD, priceInUSDT],
        });

        // 2. buy report
        const buyReportData = encodeFunctionData({
          abi: MissionBoardAbi,
          functionName: "buyReport",
          args: [BigInt(reportId), 1],
        });

        const targets: `0x${string}`[] = [MOCK_USDT, MISSION_BOARD];
        const calldatas: `0x${string}`[] = [approveData, buyReportData];
        const values: bigint[] = [BigInt(0), BigInt(0)];
        const data = encodeMulticalldata(targets, calldatas, values);

        // multicall params
        params = {
          from: account as `0x${string}`,
          to: account as `0x${string}`,
          isMulticall: true,
          multicallData: data,
          gas: BigInt(10000000),
        };
      } else {
        throw new Error("Invalid payment method");
      }

      onOpenPayment("Purchase Report", params);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack
      spacing={2}
      p={4}
      bg={"antiFlashWhite.500"}
      borderWidth="1px"
      boxShadow="lg"
      borderRadius="md"
      color="black"
    >
      <Text fontSize={"xl"} fontWeight="semibold" mb={2}>
        Purchase Report
      </Text>
      <InfoLine left={"Price in USD"} right={`${priceInUSDValue} USD`} />
      <InfoLine left={"Price in ETH"} right={`${priceInETHValue} ETH`} />
      <InfoLine left={"Price in USDT"} right={`${priceInUSDTValue} USDT`} />
      <InfoLine
        left={"Payment Method"}
        right={
          <RadioGroup
            value={paymentMethod.toString()}
            onChange={(value) => handlePaymentMethodChange(value)}
          >
            <HStack>
              <Radio value="0">ETH</Radio>
              <Radio value="1">USDT</Radio>
            </HStack>
          </RadioGroup>
        }
      />
      <Stack mt={4}>
        <Button colorScheme="charcoal" onClick={handlePurchase}>
          Purchase
        </Button>
      </Stack>
    </Stack>
  );
};

export default PurchaseBox;

import React from "react";
import { Text, VStack, HStack, Button } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { usePayment, useViem } from "@/hooks";
import { MISSION_BOARD, MOCK_USDT } from "@/libs/constant";
import { MissionBoardAbi, MockUSDTAbi } from "@/libs/abis";
import { formatEther, formatUnits } from "viem";
import { TransactionRequest } from "@/types";

interface AgentAssetsProps {
  account: `0x${string}`;
}

const AgentAssets = ({ account }: AgentAssetsProps) => {
  const { client } = useViem();
  const { onOpenPayment } = usePayment();
  const { data: ethBalance } = useQuery({
    queryKey: ["ethBalance", account],
    queryFn: async () => {
      return await client.getBalance({
        address: account,
      });
    },
  });

  const ethBalanceValue = formatEther(ethBalance || BigInt(0));

  const { data: usdtBalance } = useQuery({
    queryKey: ["usdtBalance", account],
    queryFn: async () => {
      return await client.readContract({
        address: MOCK_USDT,
        abi: MockUSDTAbi,
        functionName: "balanceOf",
        args: [account],
      });
    },
  });

  const usdtBalanceValue = formatUnits(usdtBalance || BigInt(0), 6);

  const { data: reserves } = useQuery({
    queryKey: ["reserves", account],
    queryFn: async () => {
      return await client.readContract({
        address: MISSION_BOARD,
        abi: MissionBoardAbi,
        functionName: "getBalance",
        args: [account],
      });
    },
  });

  const reservesValue = reserves || [BigInt(0), BigInt(0)];

  const ethReserve = formatEther(reservesValue[0]);
  const usdtReserve = formatUnits(reservesValue[1], 6);

  const handleWithdrawEth = () => {
    const params: TransactionRequest = {
      from: account,
      to: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "withdraw",
      args: [account, reservesValue[0], 0],
      gas: BigInt(5000000),
    };

    onOpenPayment("Withdraw ETH", params);
  };

  const handleWithdrawUsdt = async () => {
    const params: TransactionRequest = {
      from: account,
      to: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "withdraw",
      args: [account, reservesValue[1], 1],
      gas: BigInt(5000000),
    };

    onOpenPayment("Withdraw USDT", params);
  };

  return (
    <VStack spacing={4} align="start" w="full">
      <Text fontSize="md" fontFamily={""}>
        ETH Balance: {ethBalanceValue} ETH
      </Text>
      <Text fontSize="md" fontFamily={""}>
        USDT Balance: {usdtBalanceValue} USDT
      </Text>
      <HStack justify="space-between" w="full">
        <Text fontSize="md" fontFamily={""}>
          ETH Reserve: {ethReserve} ETH
        </Text>
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={handleWithdrawEth}
        >
          Withdraw
        </Button>
      </HStack>
      <HStack justify="space-between" w="full">
        <Text fontSize="md" fontFamily={""}>
          USDT Reserve: {usdtReserve} USDT
        </Text>
        <Button
          size="sm"
          colorScheme="blue"
          variant="outline"
          onClick={handleWithdrawUsdt}
        >
          Withdraw
        </Button>
      </HStack>
    </VStack>
  );
};

export default AgentAssets;

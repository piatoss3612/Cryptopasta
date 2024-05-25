import React from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Heading,
  useMediaQuery,
  Button,
} from "@chakra-ui/react";
import equipment from "@/public/equipment.jpg";
import { abbreviateAddress } from "@/libs/utils";
import { useViem } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { formatEther, formatUnits } from "viem";
import { MissionBoardAbi, MockUSDTAbi } from "@/libs/abis";
import { MISSION_BOARD, MOCK_USDT } from "@/libs/constant";

interface AgentInfoProps {
  account: `0x${string}`;
  portrait: string;
  isOwnProfile?: boolean;
}

const AgentInfo = ({ account, portrait, isOwnProfile }: AgentInfoProps) => {
  const { client } = useViem();
  const abbrAccount = abbreviateAddress(account);
  const [isLargerThanMd] = useMediaQuery("(min-width: 48em)");

  const { data: ethBalance } = useQuery({
    queryKey: ["ethBalance", account],
    queryFn: async () => {
      return await client.getBalance({
        address: account,
      });
    },
    enabled: isOwnProfile,
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
    enabled: isOwnProfile,
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
    enabled: isOwnProfile,
  });

  const reservesValue = reserves || [BigInt(0), BigInt(0)];

  const ethReserve = formatEther(reservesValue[0]);
  const usdtReserve = formatUnits(reservesValue[1], 6);

  return (
    <Box bg="gray.800" borderRadius="md" p={6}>
      <Heading size="lg" fontFamily={""}>
        Agent Profile
      </Heading>
      <HStack spacing={6} mt={4} align="center">
        <Image
          borderRadius="md"
          objectFit="cover"
          boxSize={{ base: "160px", md: "240px" }}
          src={portrait}
          alt={account}
          fallbackSrc={equipment.src}
        />
        <VStack
          flexGrow={1}
          spacing={4}
          align="start"
          justifyContent={"center"}
        >
          <Text fontSize="md" fontFamily={""}>
            {isLargerThanMd ? account : abbrAccount}
          </Text>
          {isOwnProfile && (
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
                <Button size="sm" colorScheme="blue" variant="outline">
                  Withdraw
                </Button>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="md" fontFamily={""}>
                  USDT Reserve: {usdtReserve} USDT
                </Text>
                <Button size="sm" colorScheme="blue" variant="outline">
                  Withdraw
                </Button>
              </HStack>
            </VStack>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

export default AgentInfo;

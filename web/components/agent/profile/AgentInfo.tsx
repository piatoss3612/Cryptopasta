import React from "react";
import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Heading,
  useMediaQuery,
} from "@chakra-ui/react";
import equipment from "@/public/equipment.jpg";
import { abbreviateAddress } from "@/libs/utils";
import { useViem } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { formatEther, formatUnits } from "viem";
import { MockUSDTAbi } from "@/libs/abis";
import { MOCK_USDT } from "@/libs/constant";

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

  return (
    <Box bg="gray.800" borderRadius="md" p={6}>
      <Heading size="lg" fontFamily={""}>
        Agent Profile
      </Heading>
      <HStack spacing={4} mt={4} align="start">
        <Image
          borderRadius="md"
          objectFit="cover"
          boxSize={{ base: "160px", md: "240px" }}
          src={portrait}
          alt={account}
          fallbackSrc={equipment.src}
        />
        <VStack flexGrow={1} spacing={2} align="start">
          <Text fontSize="md" fontFamily={""}>
            {isLargerThanMd ? account : abbrAccount}
          </Text>
          {isOwnProfile && (
            <>
              <Text fontSize="md" fontFamily={""}>
                ETH Balance: {ethBalanceValue} ETH
              </Text>
              <Text fontSize="md" fontFamily={""}>
                USDT Balance: {usdtBalanceValue} USDT
              </Text>
            </>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

export default AgentInfo;

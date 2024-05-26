import { Box, HStack, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import React from "react";
import equipment from "@/public/equipment.jpg";
import { useAgent, useViem } from "@/hooks";
import { CRYPTOPASTA } from "@/libs/constant";
import { CryptopastaAbi } from "@/libs/abis";
import { useQuery } from "@tanstack/react-query";
import { getTokenMetadata } from "@/actions";

interface CryptopastaProps {
  id: string;
}

const Cryptopasta = ({ id }: CryptopastaProps) => {
  const { account } = useAgent();
  const { client } = useViem();

  const getTokenURI = async (id: bigint): Promise<string> => {
    return await client.readContract({
      address: CRYPTOPASTA,
      abi: CryptopastaAbi,
      functionName: "uri",
      args: [id],
    });
  };

  const getBalance = async (id: bigint): Promise<bigint> => {
    return await client.readContract({
      address: CRYPTOPASTA,
      abi: CryptopastaAbi,
      functionName: "balanceOf",
      args: [account as `0x${string}`, id],
    });
  };

  const { data: tokenURI } = useQuery({
    queryKey: ["tokenURI", CRYPTOPASTA, id],
    queryFn: () => getTokenURI(BigInt(id)),
    enabled: id !== "",
  });

  const { data: metadata } = useQuery({
    queryKey: ["metadata", CRYPTOPASTA, tokenURI],
    queryFn: async () => getTokenMetadata(tokenURI!),
    enabled: !!tokenURI,
  });

  const { data: balance } = useQuery({
    queryKey: ["balance", CRYPTOPASTA, id],
    queryFn: () => getBalance(BigInt(id)),
    enabled: !!account && id !== "",
  });

  const name = metadata?.name.slice(0, 20) || "Unknown";
  const image = metadata?.image || equipment.src;
  const balanceString = balance?.toString() || "0";

  return (
    <Box
      position="relative"
      padding="2"
      boxShadow="lg"
      borderRadius="md"
      maxW="sm"
      border={"1px solid #E2E8F0"}
    >
      <VStack align="stretch" cursor="pointer">
        <Box position="relative" width="100%" height="auto">
          <Image
            src={image}
            borderRadius="md"
            alt={name}
            fallbackSrc={equipment.src}
          />
          <Box
            position="absolute"
            bottom="2"
            right="2"
            padding="1"
            borderRadius="md"
            bg="blackAlpha.800"
          >
            <Text color="white" fontSize="sm">
              x {balanceString}
            </Text>
          </Box>
        </Box>
        <Text fontWeight="bold" fontSize="xl" textAlign="center">
          {id}. {name}
        </Text>
      </VStack>
    </Box>
  );
};

export default Cryptopasta;

import { Box, HStack, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import React from "react";
import equipment from "@/public/equipment.jpg";
import { useViem } from "@/hooks";
import { CRYPTOPASTA } from "@/libs/constant";
import { CryptopastaAbi } from "@/libs/abis";
import { useQuery } from "@tanstack/react-query";
import { getTokenMetadata } from "@/actions";

interface CryptopastaProps {
  id: string;
  selectedReport: string;
  toggleSelectedReport: (report: string) => void;
}

const Cryptopasta = ({
  id,
  selectedReport,
  toggleSelectedReport,
}: CryptopastaProps) => {
  const isSelected = selectedReport === id;

  const { client } = useViem();

  const getTokenURI = async (id: bigint): Promise<string> => {
    return await client.readContract({
      address: CRYPTOPASTA,
      abi: CryptopastaAbi,
      functionName: "uri",
      args: [id],
    });
  };

  const { data: tokenURI } = useQuery({
    queryKey: ["tokenURI", id],
    queryFn: () => getTokenURI(BigInt(id)),
    enabled: id !== "",
  });

  const { data: metadata } = useQuery({
    queryKey: ["metadata", tokenURI],
    queryFn: async () => getTokenMetadata(tokenURI!),
    enabled: !!tokenURI,
  });

  const name = metadata?.name.slice(0, 20) || "Unknown";
  const image = metadata?.image || equipment.src;

  return (
    <Box
      position="relative"
      padding="2"
      boxShadow="lg"
      // bg={selected ? "gray.100" : "white"}
      borderRadius="md"
      maxW="sm"
      border={"1px solid #E2E8F0"}
      onClick={() => toggleSelectedReport(id)}
      sx={{
        position: "relative",
        animation: isSelected
          ? "cryptopastaSelected 1.5s infinite ease-in-out"
          : "none",
        "@keyframes cryptopastaSelected": {
          "0%, 100%": {
            boxShadow: "0 0 15px #000080, 0 0 5px #00008B",
          },
          "50%": {
            boxShadow: "0 0 25px #000080, 0 0 10px #00008B",
          },
        },
      }}
    >
      <VStack align="stretch" cursor="pointer">
        <Box width="100%" height="auto">
          <Image
            src={image}
            borderRadius="md"
            alt={name}
            fallbackSrc={equipment.src}
          />
        </Box>
        <Text fontWeight="bold" fontSize="xl" textAlign="center">
          {id}. {name}
        </Text>
      </VStack>
    </Box>
  );
};

export default Cryptopasta;

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
import AgentAssets from "./AgentAssets";
import { useRouter } from "next/navigation";

interface AgentInfoProps {
  account: `0x${string}`;
  portrait: string;
  isOwnProfile?: boolean;
}

const AgentInfo = ({ account, portrait, isOwnProfile }: AgentInfoProps) => {
  const navigator = useRouter();
  const abbrAccount = abbreviateAddress(account);
  const [isLargerThanMd] = useMediaQuery("(min-width: 48em)");

  const handleAgentAddressClick = () => {
    navigator.push(`https://sepolia.explorer.zksync.io/address/${account}`);
  };

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
          <Text fontSize="md" fontFamily={""} onClick={handleAgentAddressClick}>
            {isLargerThanMd ? account : abbrAccount}
          </Text>
          {isOwnProfile && <AgentAssets account={account} />}
        </VStack>
      </HStack>
    </Box>
  );
};

export default AgentInfo;

"use client";

import { Box, Heading, VStack } from "@chakra-ui/react";
import React from "react";
import ReportListBox from "./ReportList";
import CryptopastaCollection from "./CryptopastaCollection";
import AgentInfo from "./AgentInfo";
import { useAgent } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { getTokenMetadata } from "@/actions";
import MissionLogCollection from "./MissionLogCollection";

interface ProfileProps {
  account: `0x${string}`;
}

const Profile = ({ account }: ProfileProps) => {
  const { account: loggedInAccount, getAgentURI } = useAgent();

  const isOwnProfile =
    loggedInAccount &&
    loggedInAccount.toLocaleLowerCase() === account.toLocaleLowerCase();

  const { data: metadata } = useQuery({
    queryKey: ["profile", account],
    queryFn: async () => {
      const agentURI = await getAgentURI(account);
      if (!agentURI) return undefined;

      return await getTokenMetadata(agentURI);
    },
  });

  const portrait = metadata?.image || "";

  return (
    <Box flexGrow={1} p={4} color="white">
      <VStack
        spacing={4}
        align="stretch"
        maxW={{ base: "90%", md: "6xl" }}
        mx="auto"
      >
        <AgentInfo
          account={account}
          portrait={portrait}
          isOwnProfile={isOwnProfile}
        />
        <Box bg="gray.800" borderRadius="md" p={6}>
          <Heading size="lg" mb={4} fontFamily={""}>
            Discovered Reports
          </Heading>
          <ReportListBox account={account} />
        </Box>
        <Box bg="gray.800" borderRadius="md" p={6}>
          <Heading size="lg" mb={4} fontFamily={""}>
            Cryptopasta
          </Heading>
          <CryptopastaCollection account={account} />
        </Box>
        <Box bg="gray.800" borderRadius="md" p={6}>
          <Heading size="lg" mb={4} fontFamily={""}>
            Mission Log
          </Heading>
          <MissionLogCollection account={account} />
        </Box>
      </VStack>
    </Box>
  );
};

export default Profile;

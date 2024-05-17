"use client";

import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  WalletWithMetadata,
  useMfaEnrollment,
  usePrivy,
} from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import React from "react";

const Settings = () => {
  const { authenticated, user, setWalletPassword, exportWallet } = usePrivy();
  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const navigator = useRouter();

  const embeddedWallet = user?.linkedAccounts.find(
    (account): account is WalletWithMetadata =>
      account.type === "wallet" && account.walletClientType === "privy"
  );
  const alreadyHasPassword = embeddedWallet?.recoveryMethod === "user-passcode";

  if (!authenticated) {
    navigator.push("/");

    return null;
  }

  return (
    <Center
      flexGrow={1}
      p={4}
      maxW={{ base: "90%", lg: "48%" }}
      overflowY={"hidden"}
    >
      <VStack spacing={4}>
        <Heading>Settings</Heading>
        <VStack spacing={4} p={4}>
          <Button
            onClick={setWalletPassword}
            isDisabled={alreadyHasPassword}
            w={"100%"}
          >
            Set Password
          </Button>
          <Button onClick={showMfaEnrollmentModal} w={"100%"}>
            Set MFA
          </Button>
          <Button onClick={exportWallet} w={"100%"}>
            Export Wallet
          </Button>
        </VStack>
      </VStack>
    </Center>
  );
};

export default Settings;

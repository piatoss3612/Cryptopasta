"use client";

import { useAgent, usePayment } from "@/hooks";
import { getPaymasterApprovalParams, isZeroAddress } from "@/libs/utils";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  VStack,
  HStack,
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
  const { account } = useAgent();
  const { onOpenPayment } = usePayment();
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

  const handlePaymasterApproval = () => {
    if (isZeroAddress(account)) {
      throw new Error("Account not initialized");
    }

    const params = getPaymasterApprovalParams(account as `0x${string}`);

    onOpenPayment("Paymaster Approval", params);
  };

  const handleResetApproval = () => {
    if (isZeroAddress(account)) {
      throw new Error("Account not initialized");
    }

    const params = getPaymasterApprovalParams(account as `0x${string}`);

    params.args![1] = BigInt(0); // reset approval to 0

    onOpenPayment("Reset Approval", params);
  };

  return (
    <Center
      flexGrow={1}
      p={4}
      maxW={{ base: "90%", lg: "48%" }}
      overflowY={"hidden"}
    >
      <VStack spacing={8} w="100%">
        <Heading fontFamily={""} size={"2xl"}>
          Settings
        </Heading>
        <Flex w="80%" direction={{ base: "column", md: "row" }} gap={4}>
          <VStack w="100%" alignItems="center" spacing={4}>
            <Heading fontFamily={""} size="lg">
              Paymaster
            </Heading>
            <VStack spacing={4} w="100%">
              <Button w={"80%"} onClick={handlePaymasterApproval}>
                Approve USDT
              </Button>
              <Button w={"80%"} onClick={handleResetApproval}>
                Reset Approval
              </Button>
            </VStack>
          </VStack>
          <VStack
            w="100%"
            alignItems="center"
            spacing={4}
            mt={{ base: 4, md: 0 }}
          >
            <Heading fontFamily={""} size="lg">
              Wallet
            </Heading>
            <VStack spacing={4} w="100%">
              <Button
                onClick={setWalletPassword}
                isDisabled={alreadyHasPassword}
                w={"80%"}
              >
                Set Password
              </Button>
              <Button onClick={showMfaEnrollmentModal} w={"80%"}>
                Set MFA
              </Button>
              <Button onClick={exportWallet} w={"80%"}>
                Export
              </Button>
            </VStack>
          </VStack>
        </Flex>
      </VStack>
    </Center>
  );
};

export default Settings;

import React from "react";
import { Text, Stack, Button, useToast } from "@chakra-ui/react";
import { useAgent, usePayment, useViem } from "@/hooks";
import { TransactionRequest } from "@/types";
import { isZeroAddress } from "@/libs/utils";
import { MissionBoardAbi } from "@/libs/abis";
import { MISSION_BOARD } from "@/libs/constant";
import { useQuery } from "@tanstack/react-query";
import InfoLine from "./InfoLine";
import { formatEther, formatUnits } from "viem";

interface ClaimBoxProps {
  reportId: string;
}

const ClaimBox = ({ reportId }: ClaimBoxProps) => {
  const toast = useToast();
  const { client } = useViem();
  const { account } = useAgent();
  const { onOpenPayment } = usePayment();

  const getSales = async () => {
    if (!client) {
      throw new Error("Client is not connected");
    }

    return await client.readContract({
      address: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "getSales",
      args: [BigInt(reportId)],
    });
  };

  const { data: sales } = useQuery({
    queryKey: ["getSales"],
    queryFn: getSales,
    refetchInterval: 3000,
  });

  const salesInETH = sales ? formatEther(sales[0].salesInETH) : "0";
  const salesInUSDT = sales ? formatUnits(sales[0].salesInUSDT, 6) : "0";
  const claimedInETH = sales ? formatEther(sales[0].claimedInETH) : "0";
  const claimedInUSDT = sales ? formatUnits(sales[0].claimedInUSDT, 6) : "0";

  const handleRating = async () => {
    try {
      if (isZeroAddress(account)) {
        throw new Error("Account is not connected");
      }

      let params: TransactionRequest = {
        from: account as `0x${string}`,
        to: MISSION_BOARD as `0x${string}`,
        abi: MissionBoardAbi,
        functionName: "claimSales",
        args: [BigInt(reportId)],
        gas: BigInt(10000000),
      };

      onOpenPayment("Claim Sales", params);
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
        Claim Sales
      </Text>
      <InfoLine left="Sales in ETH" right={`${salesInETH} ETH`} />
      <InfoLine left="Sales in USDT" right={`${salesInUSDT} USDT`} />
      <InfoLine left="Claimed in ETH" right={`${claimedInETH} ETH`} />
      <InfoLine left="Claimed in USDT" right={`${claimedInUSDT} USDT`} />
      <Stack mt={4}>
        <Button colorScheme="charcoal" onClick={handleRating}>
          Claim
        </Button>
      </Stack>
    </Stack>
  );
};

export default ClaimBox;

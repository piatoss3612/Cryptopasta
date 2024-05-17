import React, { useState } from "react";
import { Text, Stack, Button, useToast, Select } from "@chakra-ui/react";
import { useAgent, usePayment, useViem } from "@/hooks";
import { TransactionRequest } from "@/types";
import { isZeroAddress } from "@/libs/utils";
import { MissionBoardAbi } from "@/libs/abis";
import { MISSION_BOARD } from "@/libs/constant";
import { useQuery } from "@tanstack/react-query";
import InfoLine from "./InfoLine";
import { formatUnits } from "viem";

interface RatingBoxProps {
  reportId: string;
}

const RatingBox = ({ reportId }: RatingBoxProps) => {
  const toast = useToast();
  const { client } = useViem();
  const { account } = useAgent();
  const { onOpenPayment } = usePayment();

  const ratingOptions = [
    { value: "0", label: "F" },
    { value: "1", label: "D" },
    { value: "2", label: "C" },
    { value: "3", label: "B" },
    { value: "4", label: "A" },
    { value: "5", label: "S" },
  ];

  const [ratingValue, setRatingValue] = useState("");

  const getRating = async () => {
    if (!client) {
      throw new Error("Client is not connected");
    }

    return await client.readContract({
      address: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "getRating",
      args: [BigInt(reportId)],
    });
  };

  const getHasRated = async () => {
    if (!client) {
      throw new Error("Client is not connected");
    }

    if (isZeroAddress(account)) {
      return true;
    }

    return await client.readContract({
      address: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "hasRated",
      args: [account as `0x${string}`, BigInt(reportId)],
    });
  };

  const { data: rating } = useQuery({
    queryKey: ["rating"],
    queryFn: getRating,
    refetchInterval: 3000,
  });

  const { data: hasRated } = useQuery({
    queryKey: ["hasRated"],
    queryFn: getHasRated,
    refetchInterval: 3000,
    enabled: !isZeroAddress(account),
  });

  const totalCount = rating ? rating[0].totalCount : BigInt(0);
  const totalRating = rating ? rating[0].totalRating : BigInt(0);
  const ratingDecimals = rating ? rating[1] : 6;
  const totalRatingValue = formatUnits(totalRating, ratingDecimals);

  const hasRatedValue = !!hasRated;

  const handleRating = async () => {
    try {
      if (isZeroAddress(account)) {
        throw new Error("Account is not connected");
      }

      if (!ratingValue) {
        throw new Error("Rating value is required");
      }

      const ratingValueInt = parseInt(ratingValue);

      let params: TransactionRequest = {
        from: account as `0x${string}`,
        to: MISSION_BOARD as `0x${string}`,
        abi: MissionBoardAbi,
        functionName: "rateReport",
        args: [BigInt(reportId), ratingValueInt],
        gas: BigInt(10000000),
      };

      onOpenPayment("Rate Report", params);
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
        Rate Report
      </Text>
      <InfoLine left="Rating" right={totalRatingValue.toString()} />
      <InfoLine left="Raters" right={totalCount.toString()} />
      <Select
        onChange={(e) => setRatingValue(e.target.value)}
        placeholder="Select Rating"
        variant="filled"
        bg="gray.100"
        isDisabled={hasRatedValue}
        size="md"
      >
        {ratingOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <Stack mt={4}>
        <Button
          colorScheme="charcoal"
          onClick={handleRating}
          isDisabled={hasRatedValue}
        >
          Rate
        </Button>
      </Stack>
    </Stack>
  );
};

export default RatingBox;

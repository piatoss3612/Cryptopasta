import React from "react";
import { Box, Badge, Text, VStack, HStack, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { abbreviateAddress } from "@/libs/utils";

interface ReportCardProps {
  reportId: string;
  reporter: string;
  title: string;
  timestamp: string;
}

const ReportCard = ({
  reportId,
  reporter,
  title,
  timestamp,
}: ReportCardProps) => {
  const navigate = useRouter();

  const abbrReporter = abbreviateAddress(reporter);
  const abbrTitle = title.length > 20 ? title.slice(0, 20) + "..." : title;
  const localTimestamp = new Date(parseInt(timestamp) * 1000).toLocaleString();

  return (
    <Box
      w="full"
      p={4}
      rounded="md"
      boxShadow="md"
      bg={"antiFlashWhite.500"}
      border={"1px solid #E2E8F0"}
      _hover={{ transform: "scale(1.01)", transition: "all 0.3s" }}
      onClick={() => {
        navigate.push(`/board/${reportId}`);
      }}
    >
      <VStack align="start" spacing={4} px={4} color="black">
        <HStack justify="space-between" w="full">
          <Text fontWeight="bold" fontSize="xl">
            {reportId}. {abbrTitle}
          </Text>
          <VStack align="end">
            <Badge bg={"richBlack.500"} color="white" fontSize="0.8em">
              {abbrReporter}
            </Badge>
            <Text fontSize="xs" color="gray.500">
              {localTimestamp}
            </Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default ReportCard;

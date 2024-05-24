import React from "react";
import { getTokenMetadata } from "@/actions";
import { abbreviateAddress } from "@/libs/utils";
import { Report } from "@/types";
import {
  Box,
  Flex,
  HStack,
  Heading,
  Image,
  Link,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import Equipment from "@/public/equipment.jpg";
import { useRouter } from "next/navigation";

interface ReportOverviewProps {
  report: Report;
}

const ReportOverview = ({ report }: ReportOverviewProps) => {
  const navigator = useRouter();
  const abbrReporter = abbreviateAddress(report.reporter);
  const localTimestamp = new Date(
    parseInt(report.blockTimestamp) * 1000
  ).toLocaleString();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["report-overview"],
    queryFn: async () => {
      return getTokenMetadata(report.contentURI);
    },
    retry: 3,
  });

  return (
    <Box
      flex={2}
      p={4}
      bg={"antiFlashWhite.500"}
      color="black"
      borderRadius={"md"}
      boxShadow={"md"}
      borderWidth={"1px"}
      minW={["100%", "100%", "68%"]}
    >
      <Heading as="h1" size="xl" my={4} fontFamily={""}>
        {report.reportId}. {report.title}
      </Heading>
      <HStack spacing={4} justify="space-between">
        <Text
          fontSize="xl"
          mb={4}
          as={Link}
          onClick={async () => {
            navigator.push(`/agent/${report.reporter}`);
          }}
        >
          {abbrReporter}
        </Text>
        <Text fontSize="xs" color="gray.500" mb={4}>
          {localTimestamp}
        </Text>
      </HStack>
      <Flex flexDirection="column">
        {isLoading && (
          <SkeletonText mt="4" noOfLines={8} spacing="4" skeletonHeight="2" />
        )}
        {data && (
          <VStack spacing={4}>
            <Box p={4} bg={"white"} borderRadius={"md"}>
              <MDEditor.Markdown source={data.description} />
            </Box>
            <Image
              src={data.image}
              alt={data.name}
              fallbackSrc={Equipment.src}
            />
          </VStack>
        )}
      </Flex>
    </Box>
  );
};

export default ReportOverview;

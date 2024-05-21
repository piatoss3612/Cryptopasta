"use client";

import { getReportById } from "@/actions";
import { Container, Flex, Spinner, useToast } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import ReportOverview from "./ReportOverview";
import InfoBoxes from "./InfoBoxes";

interface ReportDetailProps {
  id: string;
}

const ReportDetail = ({ id }: ReportDetailProps) => {
  const toast = useToast();
  const navigator = useRouter();
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ["report-detail"],
    queryFn: async () => {
      return getReportById(id);
    },
    retry: 3,
  });

  if (isLoading) {
    return <Spinner thickness="4px" size="lg" />;
  }

  if (isError) {
    toast({
      title: "Failed to fetch report",
      description: error instanceof Error ? error.message : undefined,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    navigator.back();
    return null;
  }

  if (!data) {
    return null;
  }

  console.log(data);

  return (
    <Container maxW={{ base: "88%", lg: "72%" }}>
      <Flex direction={{ base: "column", lg: "row" }} gap={4}>
        <ReportOverview report={data} />
        <InfoBoxes report={data} />
      </Flex>
    </Container>
  );
};

export default ReportDetail;

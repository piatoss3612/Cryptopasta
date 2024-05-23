"use client";

import {
  Box,
  VStack,
  Text,
  Center,
  useToast,
  Spinner,
  Button,
} from "@chakra-ui/react";
import ReportCard from "./ReportCard";
import React, { useEffect, useRef } from "react";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getReportList } from "@/actions";
import { ReportList } from "@/types";

const Reports = () => {
  const PAGE_ITEM_LIMIT = 10;

  const toast = useToast();
  const loadMoreRef = useRef(null);
  const navigator = useRouter();

  const queryReportList = async ({ pageParam }: { pageParam: any }) => {
    return getReportList(pageParam, PAGE_ITEM_LIMIT);
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<ReportList, Error>({
      queryKey: ["reports"],
      queryFn: queryReportList,
      initialPageParam: 1,
      getNextPageParam: (lastPage: ReportList, pages: ReportList[]) => {
        if (!lastPage || !lastPage.reportDiscoveries) {
          return undefined;
        }

        if (lastPage.reportDiscoveries.length < PAGE_ITEM_LIMIT) {
          return undefined;
        }

        return pages.length + 1;
      },
      placeholderData: keepPreviousData,
    });

  const hasData =
    data && data.pages.length > 0 && data.pages[0].reportDiscoveries.length > 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (isError && error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isError, error, toast]);

  return (
    <Box
      flexGrow={1}
      p={4}
      maxW={{ base: "90%", lg: "48%" }}
      h="72vh"
      overflowY={hasData ? "auto" : "hidden"}
    >
      {!isLoading && !hasData && (
        <VStack h="100%" justify="center" align="center">
          <Text fontSize="2xl">No report available.</Text>
          <Button
            bg="antiFlashWhite.500"
            color="black"
            mt={2}
            onClick={() => navigator.push("/report")}
          >
            Submit a Report
          </Button>
        </VStack>
      )}
      <VStack spacing={4}>
        {data?.pages.map((page, i) => (
          <React.Fragment key={i}>
            {page.reportDiscoveries.map((report) => (
              <ReportCard
                key={report.id}
                id={report.id}
                reportId={report.reportId}
                reporter={report.reporter}
                title={report.title}
                timestamp={report.blockTimestamp}
              />
            ))}
          </React.Fragment>
        ))}
      </VStack>
      <Center m={4} ref={loadMoreRef}>
        {hasNextPage && <Text>Load More</Text>}
      </Center>
    </Box>
  );
};

export default Reports;

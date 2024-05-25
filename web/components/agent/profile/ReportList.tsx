import { getReportList } from "@/actions";
import { ReportList } from "@/types";
import { Box, VStack, Text, useToast, Button, Center } from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import ReportCard from "./ReportCard";
import { useRouter } from "next/navigation";

interface ReportListBoxProps {
  account: string;
}

const ReportListBox = ({ account }: ReportListBoxProps) => {
  const PAGE_ITEM_LIMIT = 10;

  const toast = useToast();
  const navigator = useRouter();
  const loadMoreRef = useRef(null);

  const queryReportList = async ({ pageParam }: { pageParam: any }) => {
    return getReportList(pageParam, PAGE_ITEM_LIMIT, account);
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<ReportList, Error>({
      queryKey: ["account-reports", account],
      queryFn: queryReportList,
      initialPageParam: 1,
      getNextPageParam: (lastPage: ReportList, pages: ReportList[]) => {
        if (lastPage.reportDiscoveries.length < PAGE_ITEM_LIMIT) {
          return undefined;
        }

        return pages.length + 1;
      },
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
    <Box>
      {!hasData && (
        <VStack h="100%" justify="center" align="center">
          <Text fontSize="2xl">No Report</Text>
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
      <VStack spacing={4} m={4}>
        {data?.pages.map((page) =>
          page.reportDiscoveries.map((report) => (
            <ReportCard
              key={report.id}
              id={report.id}
              reportId={report.reportId}
              reporter={report.reporter}
              title={report.title}
              timestamp={report.blockTimestamp}
            />
          ))
        )}
        {hasNextPage && (
          <Center m={4} ref={loadMoreRef}>
            <Text>Load More</Text>
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default ReportListBox;

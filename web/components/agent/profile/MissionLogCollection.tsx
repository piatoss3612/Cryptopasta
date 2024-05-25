import React, { useEffect, useRef } from "react";

import {
  Button,
  useToast,
  VStack,
  Text,
  Center,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { MissionLogList } from "@/types";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getMissionLogList } from "@/actions";
import { useRouter } from "next/navigation";
import { isZeroAddress } from "@/libs/utils";
import MissionLog from "./MissionLog";

interface MissionLogCollectionProps {
  account: string;
}

const PAGE_ITEM_LIMIT = 100;

const MissionLogCollection = ({ account }: MissionLogCollectionProps) => {
  const navigator = useRouter();
  const toast = useToast();
  const loadMoreRef = useRef(null);

  const queryMissionLogList = async ({ pageParam }: { pageParam: any }) => {
    return getMissionLogList(account, pageParam);
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<MissionLogList, Error>({
      queryKey: ["missionLogList", account],
      queryFn: queryMissionLogList,
      initialPageParam: 1,
      getNextPageParam: (lastPage: MissionLogList, pages: MissionLogList[]) => {
        if (lastPage.transfers.length < PAGE_ITEM_LIMIT) {
          return undefined;
        }

        return pages.length + 1;
      },
      placeholderData: keepPreviousData,
      enabled: !isZeroAddress(account),
    });

  // remove duplicate cryptopasta
  const missionLogSet = new Set<string>();
  if (data) {
    data.pages.forEach((page) => {
      page.transfers.forEach((cp) => {
        missionLogSet.add(cp.tokenId);
      });
    });
  }

  const missionLogList = Array.from(missionLogSet);

  const hasData = missionLogList.length > 0;

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
      {!isLoading && !hasData && (
        <VStack h="100%" justify="center" align="center">
          <Text fontSize="2xl">No Mission Logs</Text>
          <Button
            bg="antiFlashWhite.500"
            color="black"
            mt={2}
            onClick={() => navigator.push("/board")}
          >
            Mint a Mission Log
          </Button>
        </VStack>
      )}
      <VStack spacing={4}>
        <SimpleGrid spacing={4} m={4} columns={{ base: 2, md: 4 }}>
          {missionLogList.map((id) => (
            <MissionLog key={id} id={id} />
          ))}
        </SimpleGrid>
        {hasNextPage && (
          <Center m={4} ref={loadMoreRef}>
            <Text>Load More</Text>
          </Center>
        )}
      </VStack>
    </Box>
  );
};

export default MissionLogCollection;

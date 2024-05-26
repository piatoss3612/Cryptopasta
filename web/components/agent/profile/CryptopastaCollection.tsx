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
import { CryptopastaList } from "@/types";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getCryptopastaList } from "@/actions";
import { useRouter } from "next/navigation";
import { isZeroAddress } from "@/libs/utils";
import Cryptopasta from "./Cryptopasta";

interface CryptopastaCollectionProps {
  account: string;
}

const PAGE_ITEM_LIMIT = 100;

const CryptopastaCollection = ({ account }: CryptopastaCollectionProps) => {
  const navigator = useRouter();
  const toast = useToast();
  const loadMoreRef = useRef(null);

  const queryCryptopastaList = async ({ pageParam }: { pageParam: any }) => {
    return getCryptopastaList(account, pageParam);
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<CryptopastaList, Error>({
      queryKey: ["cryptopastaList", account],
      queryFn: queryCryptopastaList,
      initialPageParam: 1,
      getNextPageParam: (
        lastPage: CryptopastaList,
        pages: CryptopastaList[]
      ) => {
        if (lastPage.transferSingles.length < PAGE_ITEM_LIMIT) {
          return undefined;
        }

        return pages.length + 1;
      },
      placeholderData: keepPreviousData,
      enabled: !isZeroAddress(account),
      refetchInterval: 5000,
      gcTime: 1000 * 60,
    });

  // remove duplicate cryptopasta
  const cryptopastaSet = new Set<string>();
  if (data) {
    data.pages.forEach((page) => {
      page.transferSingles.forEach((cp) => {
        cryptopastaSet.add(cp.cryptopasta_id);
      });
    });
  }

  const cryptopastaList = Array.from(cryptopastaSet);

  const hasData = cryptopastaList.length > 0;

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
          <Text fontSize="2xl">No Cryptopasta</Text>
          <Button
            bg="antiFlashWhite.500"
            color="black"
            mt={2}
            onClick={() => navigator.push("/board")}
          >
            Buy a Report
          </Button>
        </VStack>
      )}
      <VStack spacing={4}>
        <SimpleGrid spacing={4} m={4} columns={{ base: 2, md: 4 }}>
          {cryptopastaList.map((cp) => (
            <Cryptopasta key={cp} id={cp} />
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

export default CryptopastaCollection;

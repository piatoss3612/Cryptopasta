import React, { useEffect, useRef, useState } from "react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  VStack,
  Text,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import { useAgent } from "@/hooks";
import { CryptopastaList } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getCryptopastaList } from "@/actions";
import { useRouter } from "next/navigation";
import { isZeroAddress } from "@/libs/utils";
import Cryptopasta from "./Cryptopasta";

interface NewMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateMission: (reportID: string) => Promise<void>;
}

const PAGE_ITEM_LIMIT = 100;

const NewMissionModal = ({
  isOpen,
  onClose,
  onCreateMission,
}: NewMissionModalProps) => {
  const { account } = useAgent();
  const [selectedReport, setSelectedReport] = useState<string>("");

  const navigator = useRouter();
  const toast = useToast();
  const loadMoreRef = useRef(null);

  const toggleSelectedReport = (reportID: string) => {
    setSelectedReport((prev) => (prev === reportID ? "" : reportID));
  };

  const queryCryptopastaList = async ({ pageParam }: { pageParam: any }) => {
    return getCryptopastaList(account!, pageParam);
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<CryptopastaList, Error>({
      queryKey: ["reports"],
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
      enabled: isOpen && !isZeroAddress(account),
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

  useEffect(() => {
    if (!isOpen) {
      setSelectedReport("");
    }
  }, [isOpen]);

  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onClose={onClose}
      size={"xl"}
      isCentered
      trapFocus={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select the Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isLoading && !hasData && (
            <VStack h="100%" justify="center" align="center">
              <Text fontSize="2xl">No report available.</Text>
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
            <SimpleGrid spacing={4} m={4} columns={{ base: 1, sm: 2 }}>
              {cryptopastaList.map((cp) => (
                <Cryptopasta
                  key={cp}
                  id={cp}
                  selectedReport={selectedReport}
                  toggleSelectedReport={toggleSelectedReport}
                />
              ))}
            </SimpleGrid>
            {hasNextPage && (
              <Center m={4} ref={loadMoreRef}>
                <Text>Load More</Text>
              </Center>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          {hasData && (
            <Button
              onClick={async () => await onCreateMission(selectedReport)}
              isDisabled={!selectedReport}
              bg={"charcoal.500"}
              color={"antiFlashWhite.500"}
            >
              Create Mission
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewMissionModal;

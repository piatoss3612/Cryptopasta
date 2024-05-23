import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Button,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Mission, Missions } from "@/types";
import { useAgent } from "@/hooks";
import { getMissions } from "@/actions";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { isZeroAddress } from "@/libs/utils";

interface HistorySliderProps {
  isOpen: boolean;
  onClose: () => void;
  currentMission: Mission | null;
  handleMissionClick: (mission: Mission) => Promise<void>;
  handleNewGameClick: () => void;
}

const HistorySlider = ({
  isOpen,
  onClose,
  currentMission,
  handleMissionClick,
  handleNewGameClick,
}: HistorySliderProps) => {
  const toast = useToast();
  const { account, getAccessToken } = useAgent();
  const [missions, setMissions] = useState<Missions>([]);
  const loadMoreRef = useRef(null);

  const MISSIONS_LIMIT = 10;

  const queryMissionHistory = useCallback(
    async ({ pageParam }: { pageParam: any }): Promise<Missions> => {
      if (!account) {
        throw new Error("Please connect your wallet first");
      }

      if (isZeroAddress(account)) {
        throw new Error("Please connect your wallet first");
      }

      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      return await getMissions(
        accessToken,
        account!,
        pageParam,
        MISSIONS_LIMIT
      );
    },
    []
  );

  const { data, fetchNextPage, hasNextPage, isLoading, error, isError } =
    useInfiniteQuery<Missions, Error>({
      queryKey: ["missions", account],
      queryFn: queryMissionHistory,
      initialPageParam: undefined,
      getNextPageParam: (lastPage: Missions, pages: Missions[]) => {
        if (!lastPage) {
          return undefined;
        }

        if (lastPage.length < MISSIONS_LIMIT) {
          return undefined;
        }
        // return the last mission id of the last page
        return lastPage[lastPage.length - 1].id;
      },
      enabled: isOpen && !isZeroAddress(account),
      placeholderData: keepPreviousData,
      refetchInterval: 10000,
    });

  // Update Missions
  useEffect(() => {
    if (data) {
      // get latest page
      const latestPage = data.pages[data.pages.length - 1];
      if (!latestPage) return;

      const noDuplicateMissions = latestPage.filter(
        (mission: Mission) =>
          !missions.find((m: Mission) => m.id === mission.id)
      );
      setMissions((prevMissions) => [...prevMissions, ...noDuplicateMissions]);
    }
  }, [data]);

  // Current Mission
  useEffect(() => {
    if (currentMission) {
      // find if duplicate in missions
      const duplicateMission = missions.find(
        (mission: Mission) => mission.id === currentMission.id
      );

      // if not duplicate, add to missions
      if (!duplicateMission) {
        setMissions((prevMissions) => [currentMission, ...prevMissions]);
      }
    }
  }, [currentMission]);

  // Infinite Scroll
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
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>History</DrawerHeader>
          <DrawerBody>
            <Button w="100%" onClick={handleNewGameClick} mb={2}>
              New Game
            </Button>
            <VStack align="stretch" spacing={4} m={4}>
              {missions.map((mission, index) => (
                <Text
                  textAlign="center"
                  fontSize="lg"
                  key={index}
                  p={2}
                  borderRadius="md"
                  width="100%"
                  onClick={async () => await handleMissionClick(mission)}
                  _hover={{ bg: "gray.100", cursor: "pointer" }}
                >
                  {mission.title}
                </Text>
              ))}
              {isLoading && (
                <Center>
                  <Spinner size="lg" />
                </Center>
              )}
              <div ref={loadMoreRef} />
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default HistorySlider;

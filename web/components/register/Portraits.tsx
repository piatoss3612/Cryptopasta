import { useViem } from "@/hooks";
import { AgentRegistryAbi } from "@/libs/abis";
import { AGENT_REGISTRY } from "@/libs/constant";
import { SimpleGrid, Spinner } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import React, { Dispatch, SetStateAction } from "react";
import Portrait from "./Portrait";

interface PortraitsProps {
  portraitId: bigint | null;
  setPortraitId: Dispatch<SetStateAction<bigint | null>>;
}

const Portraits = ({ portraitId, setPortraitId }: PortraitsProps) => {
  const { client } = useViem();
  const getPortraitCount = async (): Promise<bigint> => {
    return await client.readContract({
      address: AGENT_REGISTRY,
      abi: AgentRegistryAbi,
      functionName: "portraitCount",
    });
  };

  const setPortrait = (id: bigint) => {
    if (portraitId === id) {
      setPortraitId(null);
      return;
    }
    setPortraitId(id);
  };

  const { data: portraitCount, isLoading } = useQuery({
    queryKey: ["portraitCount"],
    queryFn: getPortraitCount,
  });

  if (isLoading) {
    return <Spinner thickness="4px" size="lg" />;
  }

  return (
    <SimpleGrid my={4} columns={[1, 2, 4]} gap={4} w={["100%", "80%"]}>
      {portraitCount &&
        Array.from({ length: Number(portraitCount) }).map((_, index) => {
          const id = BigInt(index);
          return (
            <Portrait
              key={index}
              portraitId={id}
              isSelected={portraitId === id}
              setPortrait={setPortrait}
            />
          );
        })}
    </SimpleGrid>
  );
};

export default Portraits;

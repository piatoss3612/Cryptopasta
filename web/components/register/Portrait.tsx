import { useViem } from "@/hooks";
import { AgentRegistryAbi } from "@/libs/abis";
import { AGENT_REGISTRY } from "@/libs/constant";
import { TokenMetadata } from "@/libs/types";
import { Badge, Box, Image, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect } from "react";

interface PortraitProps {
  portraitId: bigint;
  isSelected: boolean;
  setPortrait: (id: bigint) => void;
}

const Portrait = ({ portraitId, isSelected, setPortrait }: PortraitProps) => {
  const { client } = useViem();
  const [uri, setUri] = React.useState<string>("");
  const [metadata, setMetadata] = React.useState<TokenMetadata | null>(null);

  const getPortrait = async (): Promise<string> => {
    return await client.readContract({
      address: AGENT_REGISTRY,
      abi: AgentRegistryAbi,
      functionName: "portrait",
      args: [portraitId],
    });
  };

  const getMetadata = async (uri: string): Promise<TokenMetadata> => {
    const response = await axios.get<TokenMetadata>(uri);
    if (response.status !== 200) {
      throw new Error("Failed to fetch metadata");
    }

    return response.data;
  };

  useEffect(() => {
    if (client) {
      getPortrait()
        .then((uri) => {
          setUri(uri);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [client]);

  useEffect(() => {
    if (uri) {
      getMetadata(uri)
        .then((metadata) => {
          setMetadata(metadata);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [uri]);

  if (!metadata) {
    return <Skeleton height="240px" width="240px" mx={10} />;
  }

  return (
    <Box
      borderRadius="lg"
      boxShadow="md"
      cursor="pointer"
      p={2}
      bg={isSelected ? "gray.300" : "white"}
      onClick={() => setPortrait(portraitId)}
    >
      {isSelected && (
        <Badge position="absolute" bg="green.500" color="white" px={2}>
          Selected
        </Badge>
      )}
      <Image src={metadata.image} width={"100%"} alt={metadata.name} />
    </Box>
  );
};

export default Portrait;

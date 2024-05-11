import { useViem } from "@/hooks";
import { AgentRegistryAbi } from "@/libs/abis";
import { AGENT_REGISTRY } from "@/libs/constant";
import { TokenMetadata } from "@/libs/types";
import { Badge, Box, Image, Skeleton } from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect } from "react";
import Equipment from "@/public/equipment.jpg";

interface PortraitProps {
  portraitId: bigint;
  isSelected: boolean;
  setPortrait: (id: bigint) => void;
}

const Portrait = ({ portraitId, isSelected, setPortrait }: PortraitProps) => {
  const { client } = useViem();
  const [uri, setUri] = React.useState<string>("");
  const [metadata, setMetadata] = React.useState<TokenMetadata | null>(null);

  const getPortrait = useCallback(async (): Promise<string> => {
    return await client.readContract({
      address: AGENT_REGISTRY,
      abi: AgentRegistryAbi,
      functionName: "portrait",
      args: [portraitId],
    });
  }, [client, portraitId]);

  const getMetadata = useCallback(
    async (uri: string): Promise<TokenMetadata> => {
      const response = await axios.get<TokenMetadata>(uri);
      if (response.status !== 200) {
        throw new Error("Failed to fetch metadata");
      }

      return response.data;
    },
    []
  );

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
  }, [client, getPortrait]);

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
  }, [uri, getMetadata]);

  return (
    <Box
      borderRadius="lg"
      boxShadow="md"
      cursor="pointer"
      p={2}
      bg={isSelected ? "gray.300" : "white"}
      onClick={() => setPortrait(portraitId)}
      sx={{
        position: "relative",
        animation: isSelected
          ? "electricFlow 1.5s infinite ease-in-out"
          : "none",
        "@keyframes electricFlow": {
          "0%, 100%": {
            boxShadow: "0 0 15px #00ff00, 0 0 5px #0000ff",
          },
          "50%": {
            boxShadow: "0 0 25px #00ff00, 0 0 10px #0000ff",
          },
        },
      }}
    >
      {isSelected && (
        <Badge position="absolute" bg="green.500" color="white" px={2}>
          Selected
        </Badge>
      )}
      <Image
        src={metadata?.image}
        width={"100%"}
        alt={metadata?.name}
        fallbackSrc={Equipment.src}
      />
    </Box>
  );
};

export default Portrait;

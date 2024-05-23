import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Textarea,
  Image,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { TokenMetadata } from "@/types";
import { TransactionRequest } from "viem";
import { getMissionLogMintParams } from "@/libs/utils";
import { useAgent, usePayment } from "@/hooks";
import { pinJsonToIPFS } from "@/actions";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  description: string;
}

const MintModal = ({ isOpen, onClose, image, description }: MintModalProps) => {
  const toast = useToast();
  const { account, getAccessToken } = useAgent();
  const { onOpenPayment } = usePayment();

  const [nftName, setNftName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokenUri, setTokenUri] = useState("");

  const handleMint = async () => {
    try {
      setIsLoading(true);

      if (!account) {
        throw new Error("Account not found");
      }

      let uri = tokenUri;

      if (!uri) {
        const accessToken = await getAccessToken();

        if (!accessToken) {
          throw new Error("Access token not found");
        }

        const tokenResponse = await pinJsonToIPFS(
          nftName,
          description,
          image,
          accessToken
        );

        uri = `https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/${tokenResponse.IpfsHash}`;
        setTokenUri(uri);
      }

      const params = getMissionLogMintParams(account!, uri);

      onOpenPayment("Mint Mission Log", params, () => {
        setNftName("");
        setTokenUri("");
        onClose();
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Mint NFT</ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />
        <ModalBody>
          <VStack spacing={4}>
            <Image src={image} alt="NFT Image" />
            <Textarea value={description} isReadOnly />
            <Input
              placeholder="Enter NFT Name"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={handleMint}
            isLoading={isLoading}
          >
            Mint
          </Button>
          <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MintModal;

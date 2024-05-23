import { useAgent } from "@/hooks";
import { abbreviateAddress } from "@/libs/utils";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
  portraitId: bigint;
}

const RegisterModal = ({ isOpen, onClose, portraitId }: RegisterProps) => {
  const { register, wallet } = useAgent();
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const navigator = useRouter();

  const handleClose = () => {
    onClose();
    navigator.push("/");
  };

  const registerAgent = useCallback(async () => {
    try {
      setIsRegistering(true);
      setMessage("Registering agent...");

      const response = await register(portraitId);

      if (!response) {
        throw new Error("Failed to register agent");
      }

      setDone(true);
      setMessage(
        `Agent registered with address ${abbreviateAddress(
          response.agent_account
        )}`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(true);
      setMessage(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  }, [wallet, portraitId]);

  useEffect(() => {
    registerAgent();
  }, []);

  return (
    <Modal
      isCentered
      onClose={handleClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size={{ base: "md", md: "lg" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Registering Session</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Center m={8}>
            <Stack spacing={8} justify="center" align="center">
              {done && (
                <CheckCircleIcon
                  name="check-circle"
                  color="green.500"
                  boxSize={"2.4rem"}
                />
              )}
              {error && (
                <WarningIcon
                  name="warning"
                  color="red.500"
                  boxSize={"2.4rem"}
                />
              )}
              {isRegistering && <Spinner thickness="4px" size="lg" />}
              {message && <Text>{message}</Text>}
            </Stack>
          </Center>
        </ModalBody>
        {done && (
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleClose}>
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;

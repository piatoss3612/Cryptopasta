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

interface Event {
  type: string;
  id: string;
  data: { agent_account: string; token_id: string } | string;
}

const AGENT_REGISTER_START_EVENT = "agent_register_start";
const AGENT_REGISTER_SUCCESS_EVENT = "agent_register_success";
const AGENT_REGISTER_ERROR_EVENT = "agent_register_error";

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
  portraitId: bigint;
}

const RegisterModal = ({ isOpen, onClose, portraitId }: RegisterProps) => {
  const { register, wallet } = useAgent();
  const [events, setEvents] = useState<Event[]>([]);
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
    const reader = await register(portraitId);
    const decoder = new TextDecoder("utf-8");

    const readChunk = async (): Promise<void> => {
      const { done, value } = await reader.read();

      if (done) {
        return;
      }

      const message = decoder.decode(value, { stream: true });

      const event = JSON.parse(message) as Event;

      setEvents((prev) => [...prev, event]);

      return readChunk();
    };

    await readChunk();
  }, [wallet, portraitId]);

  useEffect(() => {
    registerAgent();
  }, []);

  useEffect(() => {
    if (events.length === 0) {
      return;
    }

    const lastEvent = events[events.length - 1];

    if (lastEvent.type === AGENT_REGISTER_START_EVENT) {
      setIsRegistering(true);
      setMessage(lastEvent.data as string);
    } else if (lastEvent.type === AGENT_REGISTER_SUCCESS_EVENT) {
      const data = lastEvent.data as {
        agent_account: string;
        token_id: string;
      };
      setIsRegistering(false);
      setDone(true);
      setMessage(`Agent ${abbreviateAddress(data.agent_account)} registered!`);
    } else if (lastEvent.type === AGENT_REGISTER_ERROR_EVENT) {
      setIsRegistering(false);
      setError(true);
      setMessage(lastEvent.data as string);
    } else {
      console.log("Unknown event", lastEvent);
    }
  }, [events]);

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

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
import React, { useEffect, useRef, useState } from "react";

type MessageType = "id" | "event" | "error";

interface WebSocketMessage {
  type: MessageType;
  id: string;
  event: Event;
}

type EventStatus = "IN_PROGRESS" | "ERROR" | "DONE";

interface Event {
  name: string;
  status: EventStatus;
  data: { agent_account: string; token_id: string } | string;
}

const AGENT_REGISTER_EVENT = "agent_register";

interface RegisterProps {
  isOpen: boolean;
  onClose: () => void;
  portraitId: bigint;
}

const RegisterModal = ({ isOpen, onClose, portraitId }: RegisterProps) => {
  const { register } = useAgent();
  const [sessionId, setSessionId] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const websocket = useRef<WebSocket | null>(null);
  const navigator = useRouter();

  const handleClose = () => {
    websocket.current?.close();
    onClose();
  };

  const handleCloseOnRegistered = () => {
    onClose();
    navigator.push("/");
  };

  useEffect(() => {
    try {
      const ws = new WebSocket("ws://localhost:8080/ws");
      websocket.current = ws;
      setIsRegistering(true);

      ws.onopen = () => {
        console.log("WebSocket opened");
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };

      ws.onerror = (error) => {
        console.error(error);
      };

      ws.onmessage = (event) => {
        const message: WebSocketMessage = JSON.parse(event.data);
        switch (message.type) {
          case "id":
            setSessionId(message.id);
            setMessage("Session established...");
            break;
          case "event":
            setEvents((prev) => [...prev, message.event]);
            break;
          case "error":
            const errMessage = event.data as string;
            setError(true);
            setIsRegistering(false);
            setMessage(errMessage);
            break;
        }
      };
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (events.length) {
      const currentEvent = events[events.length - 1];

      if (currentEvent.name === AGENT_REGISTER_EVENT) {
        if (currentEvent.status === "IN_PROGRESS") {
          setIsRegistering(true);
          setMessage("Registering agent...");
        } else if (currentEvent.status === "DONE") {
          const data = currentEvent.data as { agent_account: string };
          const accountAddr = abbreviateAddress(data.agent_account);
          setIsRegistering(false);
          setDone(true);
          setMessage(`${accountAddr}\nregistered successfully`);
        } else {
          const errMessage = currentEvent.data as string;
          setIsRegistering(false);
          setError(true);
          setMessage(errMessage);
        }
      }
    }
  }, [events]);

  useEffect(() => {
    if (websocket && sessionId) {
      register(sessionId, portraitId)
        .then(() => {
          console.log("Agent registered");
        })
        .catch((error) => {
          setError(true);
          setIsRegistering(false);
          setMessage(error.message);
        });
    }
  }, [websocket, sessionId]);

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
            <Button colorScheme="blue" onClick={handleCloseOnRegistered}>
              Close
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default RegisterModal;

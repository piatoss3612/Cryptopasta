"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  useDisclosure,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import HistorySlider from "./HistorySlider";
import MessageForm from "./MessageForm";
import { Missions, Entry, Mission, Message } from "@/types";
import MessageList from "./MessageList";
import { useAgent } from "@/hooks";
import NewMissionModal from "./NewMissionModal";
import { HamburgerIcon } from "@chakra-ui/icons";
import { isZeroAddress } from "@/libs/utils";
import axios from "axios";
import { getEntries, getMissions } from "@/actions";
import { useInfiniteQuery } from "@tanstack/react-query";

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
  data: any;
}

const CHAT_EVENT = "chat";
const MISSION_CREATE_SUCCESS_EVENT = "mission_create_success";
const MISSION_ACT_SUCCESS_EVENT = "mission_act_success";

const MissionRoom = () => {
  const { account, avatar, getAccessToken } = useAgent();
  const toast = useToast();
  const {
    isOpen: isNewGameModalOpen,
    onOpen: onOpenNewGameModal,
    onClose: onCloseNewGameModal,
  } = useDisclosure();
  const {
    isOpen: isHistorySliderOpen,
    onOpen: onOpenHistorySlider,
    onClose: onCloseHistorySlider,
  } = useDisclosure();
  // websocket
  const webSocket = useRef<WebSocket | null>(null);
  const [sessionID, setSessionID] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // mission
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTypingId, setCurrentTypingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setupWebSocket = useCallback(async () => {
    const token = await getAccessToken();

    if (!token) {
      throw new Error("Failed to get access token");
    }

    const ws = new WebSocket(`ws://localhost:8080/mission/ws?token=${token}`);
    webSocket.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);

      switch (message.type) {
        case "id":
          setSessionID(message.id);
          break;
        case "event":
          const currentEvent = message.event;
          handleWebSocketEvent(currentEvent);
          break;
        case "error":
          setError(message.event.data);
          break;
      }
    };
  }, [getAccessToken]);

  const handleWebSocketEvent = useCallback((event: Event) => {
    switch (event.name) {
      case CHAT_EVENT:
        const data = event.data as string;

        if (data && data.length) {
          const id = Date.now().toString();
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: id,
              content: data,
              isUser: false,
              isReport: false,
              isTyping: true,
            },
          ]);
          setCurrentTypingId(id);
        }
        break;
      case MISSION_CREATE_SUCCESS_EVENT:
        const newMission = event.data as Mission;

        if (newMission) {
          setCurrentMission(newMission);
        }
        break;
      case MISSION_ACT_SUCCESS_EVENT:
        // TODO: handle mission act success event
        break;
      default:
      // error handling
    }
  }, []);

  const handleMissionClick = useCallback(async (mission: Mission) => {
    if (!mission) {
      return;
    }

    try {
      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      // Clear current mission
      setCurrentMission(null);
      setMessages([]);
      setCurrentTypingId(null);

      const response = await getEntries(accessToken, mission.id);
      const entries = response.entries;

      if (!entries) {
        throw new Error("Failed to get entries");
      }

      const messages: Message[] = [];

      for (const entry of entries) {
        const systemMessages: Message[] = [];
        const userMessages: Message[] = [];
        for (const message of entry.messages) {
          if (message.isReport) {
            continue;
          }

          if (message.isUser) {
            userMessages.push(message);
          } else {
            systemMessages.push(message);
          }
        }

        if (entry.image) {
          systemMessages.push({
            content: entry.image,
            isUser: false,
            isImage: true,
          });
        }

        messages.push(...userMessages, ...systemMessages);
      }

      setCurrentMission(mission);
      setMessages(messages);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onCloseHistorySlider();
    }
  }, []);

  const handleCreateMission = useCallback(
    async (reportID: string) => {
      onCloseNewGameModal();
      onCloseHistorySlider();

      try {
        setIsLoading(true);

        if (isZeroAddress(account)) {
          throw new Error("Please connect your wallet first");
        }

        if (reportID === "") {
          throw new Error("Please enter a valid report ID");
        }

        const accessToken = await getAccessToken();

        if (!accessToken) {
          throw new Error("Failed to get access token");
        }

        // clear current mission
        setCurrentMission(null);
        setMessages([]);
        setCurrentTypingId(null);

        const response = await axios.post(
          `http://localhost:8080/mission?sessionID=${sessionID}`,
          {
            agent_id: account,
            report_id: reportID,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to create mission");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";

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
    },
    [account, getAccessToken, sessionID, toast]
  );

  const handleSendMessage = async (message: string) => {
    // TODO: send message to WebSocket
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, isUser: true, isReport: false },
      {
        id: Date.now().toString(),
        content: `Your message is: "${message}"`,
        isUser: false,
        isReport: false,
        isTyping: true,
      },
    ]);
  };

  const handleEndTyping = useCallback((id: string | undefined) => {
    if (id === undefined) return;

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, isTyping: false } : msg
      )
    );
    setCurrentTypingId(null);
  }, []);

  // WebSocket Connection
  useEffect(() => {
    if (!webSocket.current) {
      setupWebSocket().catch((error) => {
        console.error("Failed to setup WebSocket", error);
      });
    }
  }, [webSocket, setupWebSocket]);

  // Track Typing
  useEffect(() => {
    if (currentTypingId === null) {
      const nextTypingMessage = messages.find(
        (msg) => !msg.isUser && msg.isTyping
      );

      if (nextTypingMessage && nextTypingMessage.id) {
        setCurrentTypingId(nextTypingMessage.id);
      }
    }
  }, [messages, currentTypingId]);

  return (
    <>
      {/* New Mission Modal */}
      <NewMissionModal
        isOpen={isNewGameModalOpen}
        onClose={onCloseNewGameModal}
        onCreateMission={handleCreateMission}
      />
      {/* History Slider */}
      <HistorySlider
        isOpen={isHistorySliderOpen}
        onClose={onCloseHistorySlider}
        currentMission={currentMission}
        handleMissionClick={handleMissionClick}
        handleNewGameClick={onOpenNewGameModal}
      />
      {/* Main Content */}
      <Box flexGrow={1} p={4} maxW={{ base: "88%", lg: "72%" }}>
        <VStack spacing={4} align="stretch">
          <MessageList
            messages={messages}
            userAvatar={avatar}
            onEndTyping={handleEndTyping}
          />
          <HStack>
            <IconButton
              icon={<HamburgerIcon />}
              onClick={onOpenHistorySlider}
              aria-label="Open History"
            />
            <MessageForm onSendMessage={handleSendMessage} />
          </HStack>
        </VStack>
      </Box>
    </>
  );
};

export default MissionRoom;

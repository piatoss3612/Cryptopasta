"use client";

import React, { useEffect, useState } from "react";
import { Box, VStack, HStack } from "@chakra-ui/react";
import HistorySlider from "./HistorySlider";
import MessageForm from "./MessageForm";
import { ChatHistory, Message } from "@/types";
import MessageList from "./MessageList";

const Mission = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTypingId, setCurrentTypingId] = useState<number | null>(null);

  const handleSendMessage = async (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: message, isUser: true },
      {
        id: Date.now(),
        content: `Your message is: "${message}"`,
        isUser: false,
        isTyping: true,
      },
    ]);
  };

  const handleEndTyping = (id: number | undefined) => {
    if (id === undefined) return;

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, isTyping: false } : msg
      )
    );
    setCurrentTypingId(null);
  };

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
    <Box flexGrow={1} p={4} maxW={{ base: "88%", lg: "72%" }}>
      <VStack spacing={4} align="stretch">
        <MessageList messages={messages} onEndTyping={handleEndTyping} />
        <HStack>
          <HistorySlider chatHistory={chatHistory} />
          <MessageForm onSendMessage={handleSendMessage} />
        </HStack>
      </VStack>
    </Box>
  );
};

export default Mission;

import React, { useEffect, useRef } from "react";
import Typist from "react-typist";
import { VStack, Card, CardBody, Box, Avatar, HStack } from "@chakra-ui/react";
import { Message } from "@/types";
import SystemImage from "@/public/system.jpg";

interface MessageListProps {
  messages: Message[];
  userAvatar: string;
  onEndTyping: (id: string | undefined) => void;
}

const MessageList = ({
  messages,
  userAvatar,
  onEndTyping,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <VStack
      spacing={4}
      overflowY="auto"
      border="1px solid gray"
      borderRadius="md"
      p={4}
      h="60vh"
      alignItems="stretch"
    >
      {messages.map((message, idx) => (
        <HStack
          key={idx}
          justifyContent={message.isUser ? "flex-end" : "flex-start"}
          spacing={4}
        >
          {!message.isUser && (
            <Avatar name="System" src={SystemImage.src} loading="eager" />
          )}
          <Box
            display="flex"
            flexDirection={message.isUser ? "row-reverse" : "row"}
            alignItems="center"
          >
            <Card
              maxW={"70%"}
              backgroundColor={message.isUser ? "blue.100" : "gray.100"}
            >
              <CardBody wordBreak={"break-word"}>
                {message.isTyping ? (
                  <Typist
                    stdTypingDelay={5}
                    avgTypingDelay={5}
                    cursor={{ show: false }}
                    onTypingDone={() => onEndTyping(message.id)}
                  >
                    <div>{message.content}</div>
                  </Typist>
                ) : (
                  <div>{message.content}</div>
                )}
              </CardBody>
            </Card>
          </Box>
          {message.isUser && (
            <Avatar name="User" src={userAvatar} loading="eager" />
          )}
        </HStack>
      ))}
      <div ref={bottomRef} />
    </VStack>
  );
};

export default MessageList;

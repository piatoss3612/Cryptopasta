import React, { useEffect, useRef } from "react";
import Typist from "react-typist";
import { VStack, Card, CardBody, Box } from "@chakra-ui/react";
import { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
  onEndTyping: (id: number | undefined) => void;
}

const MessageList = ({ messages, onEndTyping }: MessageListProps) => {
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
      h="68vh"
      alignItems="stretch"
    >
      {messages.map((message, idx) => (
        <Box
          key={idx}
          display="flex"
          justifyContent={message.isUser ? "flex-end" : "flex-start"}
        >
          <Card backgroundColor={message.isUser ? "gray.100" : "white"}>
            <CardBody>
              {message.isTyping ? (
                <Typist
                  stdTypingDelay={50}
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
      ))}
      <div ref={bottomRef} />
    </VStack>
  );
};

export default MessageList;

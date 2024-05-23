import { Button, HStack, Input } from "@chakra-ui/react";
import React, { useState } from "react";

interface MessageFormProps {
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
  isFullscreen: boolean;
}

const MessageForm = ({
  isLoading,
  onSendMessage,
  isFullscreen,
}: MessageFormProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <HStack
      as={"form"}
      onSubmit={handleSubmit}
      width={"100%"}
      p={isFullscreen ? 4 : 0}
      bg={isFullscreen ? "rgba(0,0,0,0.85)" : "inherit"}
      position={isFullscreen ? "fixed" : "relative"}
      bottom={isFullscreen ? 0 : "auto"}
      left={isFullscreen ? 0 : "auto"}
      zIndex={isFullscreen ? 1001 : "auto"}
      color={isFullscreen ? "white" : "inherit"}
    >
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        isDisabled={isLoading}
        color={isFullscreen ? "white" : "black"}
      />
      <Button type="submit" isDisabled={isLoading || !message}>
        Send
      </Button>
    </HStack>
  );
};

export default MessageForm;

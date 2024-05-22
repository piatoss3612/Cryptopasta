import { Button, HStack, Input } from "@chakra-ui/react";
import React, { useState } from "react";

interface MessageFormProps {
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
}

const MessageForm = ({ isLoading, onSendMessage }: MessageFormProps) => {
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
    <HStack as={"form"} onSubmit={handleSubmit} width={"100%"}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        isDisabled={isLoading}
      />
      <Button type="submit" isDisabled={isLoading || !message}>
        Send
      </Button>
    </HStack>
  );
};

export default MessageForm;

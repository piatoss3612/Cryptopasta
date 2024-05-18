import { Button, HStack, Input } from "@chakra-ui/react";
import React, { useState } from "react";

interface MessageFormProps {
  onSendMessage: (message: string) => Promise<void>;
}

const MessageForm = ({ onSendMessage }: MessageFormProps) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setSending(true);
      await onSendMessage(message);
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <HStack as={"form"} onSubmit={handleSubmit} width={"100%"}>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <Button type="submit" isDisabled={sending || !message}>
        Send
      </Button>
    </HStack>
  );
};

export default MessageForm;

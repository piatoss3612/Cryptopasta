import React, { useEffect, useRef, useState } from "react";
import Typist from "react-typist";
import ReactMarkdown from "react-markdown";
import {
  VStack,
  Card,
  CardBody,
  Box,
  Avatar,
  HStack,
  Image,
  Heading,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { Message } from "@/types";
import SystemImage from "@/public/system.jpg";
import equipment from "@/public/equipment.jpg";
import MintModal from "./MintModal";

interface MessageListProps {
  messages: Message[];
  userAvatar: string;
  onEndTyping: (id: string | undefined) => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

const Markdown = ({ content }: { content: string }) => (
  <ReactMarkdown
    className={"markdown"}
    components={{
      code({ node, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
          <SyntaxHighlighter
            style={materialOceanic}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      div: ({ children }) => <Box fontFamily={"sans-serif"}>{children}</Box>,
      h1: ({ children }) => (
        <Box mb={2}>
          <Heading fontSize="2xl" mt={4} mb={2}>
            {children}
          </Heading>
          <Box as="hr" />
        </Box>
      ),
      h2: ({ children }) => (
        <Box mb={2}>
          <Heading fontSize="xl" mt={4} mb={2}>
            {children}
          </Heading>
          <Box as="hr" />
        </Box>
      ),
      h3: ({ children }) => (
        <Box mb={2}>
          <Heading fontSize="lg" mt={4} mb={2}>
            {children}
          </Heading>
          <Box as="hr" />
        </Box>
      ),
      hr: () => <Box as="hr" my={2} />,
    }}
  >
    {content}
  </ReactMarkdown>
);

const MessageList = ({
  messages,
  userAvatar,
  onEndTyping,
  isFullscreen,
  toggleFullscreen,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");

  const handleImageClick = (b64Image: string, description: string) => {
    setSelectedImage(b64Image);
    setSelectedDescription(description);
    onOpen();
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <MintModal
        isOpen={isOpen}
        onClose={onClose}
        image={selectedImage}
        description={selectedDescription}
      />
      <VStack
        spacing={4}
        overflowY="auto"
        border="1px solid gray"
        borderRadius="md"
        p={4}
        h={isFullscreen ? "90%" : "60vh"}
        w={isFullscreen ? "100vw" : "auto"}
        position={isFullscreen ? "fixed" : "relative"}
        top={isFullscreen ? 0 : "auto"}
        left={isFullscreen ? 0 : "auto"}
        zIndex={isFullscreen ? 1001 : "auto"}
        bg={isFullscreen ? "rgba(0, 0, 0, 0.85)" : "inherit"}
        color={isFullscreen ? "white" : "inherit"}
      >
        <HStack justifyContent="flex-end" w="100%">
          <IconButton
            aria-label="Toggle Fullscreen"
            icon={isFullscreen ? <FiMinimize /> : <FiMaximize />}
            onClick={toggleFullscreen}
            zIndex={1002}
          />
        </HStack>
        {messages.map((message, idx) => (
          <HStack
            key={idx}
            justifyContent={message.isUser ? "flex-end" : "flex-start"}
            spacing={4}
            w="100%"
          >
            {!message.isUser && (
              <Avatar name="System" src={SystemImage.src} loading="eager" />
            )}
            <Box
              display="flex"
              flexDirection={message.isUser ? "row-reverse" : "row"}
              alignItems="center"
              w="100%"
            >
              {message.isImage ? (
                <Card mx={isFullscreen ? 0 : 4} p={2} maxW="40%">
                  <Image
                    src={`data:image/png;base64,${message.b64Image}`}
                    alt="Image"
                    objectFit="cover"
                    fallbackSrc={equipment.src}
                    cursor="pointer"
                    onClick={() =>
                      handleImageClick(
                        `data:image/png;base64,${message.b64Image}`,
                        message.content
                      )
                    }
                  />
                </Card>
              ) : (
                <Card
                  backgroundColor={message.isUser ? "blue.100" : "gray.100"}
                  color="black"
                  maxW={"72%"}
                  mx={isFullscreen ? 0 : 4}
                  p={2}
                >
                  <CardBody>
                    {message.isTyping ? (
                      <Typist
                        stdTypingDelay={5}
                        avgTypingDelay={5}
                        cursor={{ show: false }}
                        onTypingDone={() => onEndTyping(message.id)}
                      >
                        {message.content}
                      </Typist>
                    ) : (
                      <Markdown content={message.content} />
                    )}
                  </CardBody>
                </Card>
              )}
            </Box>
            {message.isUser && (
              <Avatar name="User" src={userAvatar} loading="eager" />
            )}
          </HStack>
        ))}
        <div ref={bottomRef} />
      </VStack>
    </>
  );
};

export default MessageList;

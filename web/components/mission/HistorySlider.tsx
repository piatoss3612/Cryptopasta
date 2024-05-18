import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  VStack,
  Text,
  useDisclosure,
  Button,
  HStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ChatHistory } from "@/types";

interface HistorySliderProps {
  chatHistory: ChatHistory;
}

const HistorySlider = ({ chatHistory }: HistorySliderProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <HStack spacing={2}>
        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          aria-label="Open History"
        />
      </HStack>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>History</DrawerHeader>
            <DrawerBody>
              <Button>New Game</Button>
              <VStack align="stretch">
                {chatHistory.map((item, index) => (
                  <Text key={index} p={2} borderBottom="1px solid gray">
                    {item.title}
                  </Text>
                ))}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default HistorySlider;

"use client";

import {
  Flex,
  Box,
  Image,
  Link,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Logo from "@/public/logo.jpg";
import NextLink from "next/link";
import AccountMenu from "./AccountMenu";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        as="nav"
        align="center"
        justify={{ base: "space-between" }}
        wrap="wrap"
        padding="1rem"
        color="white"
        top="0"
        left="0"
        right="0"
        zIndex="banner"
        mx={6}
      >
        <NextLink href="/" passHref>
          <Link
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: "none" }}
          >
            <Image src={Logo.src} boxSize="80px" alt="Project Logo" />
          </Link>
        </NextLink>

        <Box display={{ base: "none", lg: "block" }}>
          <AccountMenu />
        </Box>

        <IconButton
          display={{ lg: "none" }}
          icon={<HamburgerIcon />}
          onClick={onOpen}
          aria-label="Open menu"
        />
      </Flex>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay display={{ base: "block", lg: "none" }} />
        <DrawerContent display={{ base: "block", lg: "none" }}>
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody mt={2}>
            <VStack spacing="24px">
              <NextLink href="/" passHref>
                <Link onClick={onClose}>Home</Link>
              </NextLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;

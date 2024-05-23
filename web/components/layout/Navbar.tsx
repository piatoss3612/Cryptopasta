"use client";

import { Flex } from "@chakra-ui/react";
import Menu from "./Menu";
import Logo from "./Logo";

const Navbar = () => {
  return (
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
      zIndex="auto"
      mx={6}
    >
      <Logo />
      <Menu />
    </Flex>
  );
};

export default Navbar;

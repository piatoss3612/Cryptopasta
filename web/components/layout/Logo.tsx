import React from "react";
import { Image, Link } from "@chakra-ui/react";
import LogoImage from "@/public/logo.jpg";
import NextLink from "next/link";

const Logo = () => {
  return (
    <NextLink href="/" passHref>
      <Link
        display="flex"
        alignItems="center"
        _hover={{ textDecoration: "none" }}
      >
        <Image
          src={LogoImage.src}
          boxSize="80px"
          alt="Project Logo"
          borderRadius={"12px"}
        />
      </Link>
    </NextLink>
  );
};

export default Logo;

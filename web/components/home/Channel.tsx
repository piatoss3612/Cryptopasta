import { Box, Heading, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

interface RouteProps {
  path: string;
  src: string;
  alt: string;
}

const Channel = ({ path, src, alt }: RouteProps) => {
  const navigator = useRouter();

  const handleChannelClick = () => {
    navigator.push(path);
  };

  return (
    <Box
      w="100%"
      h="100%"
      p={4}
      textAlign="center"
      cursor="pointer"
      borderRadius="md"
      onClick={handleChannelClick}
      sx={{
        "&:hover": {
          background: `linear-gradient(270deg, var(--chakra-colors-blue-900), var(--chakra-colors-yellow-100), var(--chakra-colors-blue-900), var(--chakra-colors-yellow-100))`,
          backgroundSize: "400% 400%",
          animation:
            "electricFlow 2s ease infinite, gradientShift 5s ease infinite",
          color: "white",
          boxShadow:
            "0 0 8px var(--chakra-colors-yellow-100), 0 0 20px var(--chakra-colors-yellow-100) inset",
          textShadow: "0 0 8px var(--chakra-colors-yellow-100)",
        },
        "@keyframes electricFlow": {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        "@keyframes gradientShift": {
          "0%": {
            backgroundColor: "var(--chakra-colors-blue-900)",
          },
          "50%": {
            backgroundColor: "var(--chakra-colors-yellow-100)",
          },
          "100%": {
            backgroundColor: "var(--chakra-colors-blue-900)",
          },
        },
      }}
    >
      <Image src={src} alt={alt} borderRadius="md" />
      <Heading size="lg" textAlign="center" fontFamily={""} mt={4}>
        {alt}
      </Heading>
    </Box>
  );
};

export default Channel;

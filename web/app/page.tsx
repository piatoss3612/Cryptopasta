import Main from "@/components/Main";
import { Box, Center } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" bg="gray.300">
      <Center my="auto">
        <Main />
      </Center>
    </Box>
  );
}

import { Box, Center } from "@chakra-ui/react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Main({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      color="antiFlashWhite.500"
      bgGradient={"linear(to-r, richBlack.500, richBlack.300)"}
    >
      <Navbar />
      <Center flexGrow={1}>{children}</Center>
      <Footer />
    </Box>
  );
}

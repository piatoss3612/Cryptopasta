"use client";

import * as React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AgentProvider } from "@/context/AgentProvider";
import { PaymasterProvider } from "@/context/PaymasterProvider";

const queryClient = new QueryClient();

/**
 * 
--rich-black: #000019ff;
--cadet-gray: #989DA7ff;
--rich-black-2: #00001Cff;
--rich-black-3: #000119ff;
--charcoal: #37394Bff;
--antiflash-white: #E2E8ECff;
 */
const theme = extendTheme({
  colors: {
    richBlack: {
      300: "#060718e4",
      500: "#000019ff",
    },
    cadetGray: {
      500: "#989DA7ff",
    },
    charcoal: {
      500: "#37394Bff",
    },
    antiFlashWhite: {
      500: "#E2E8ECff",
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: "https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/QmZ7RWMj8kWSzJjQBnqGBS5TsB5U1H8AK6dhZFB91tVpRw",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AgentProvider>
            <PaymasterProvider>{mounted && children}</PaymasterProvider>
          </AgentProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </PrivyProvider>
  );
}

"use client";

import * as React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

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
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          {mounted && children}
        </QueryClientProvider>
      </ChakraProvider>
    </PrivyProvider>
  );
}

import { usePrivy, useWallets } from "@privy-io/react-auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const WalletContext = createContext(undefined);

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    if (ready && authenticated) {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (embeddedWallet) {
        // TODO: Initialize the native aa account
      }
    }
  }, [wallets]);
};

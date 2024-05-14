import { registerAgent } from "@/actions";
import { useViem } from "@/hooks";
import { AgentRegistryAbi } from "@/libs/abis";
import { AGENT_REGISTRY } from "@/libs/constant";
import { isZeroAddress } from "@/libs/utils";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import React, { createContext, useCallback, useEffect, useState } from "react";
import { WalletClient, createWalletClient, custom } from "viem";
import { eip712WalletActions, zkSyncSepoliaTestnet } from "viem/zksync";

interface AgentContextType {
  ready: boolean;
  authenticated: boolean;
  isLoading: boolean;
  getAccessToken: () => Promise<string | null>;
  login: () => void;
  logout: () => Promise<void>;
  wallet: ConnectedWallet | null;
  walletClient: WalletClient | null;
  account: `0x${string}` | undefined;
  register: (sessionId: string, portraitId: bigint) => Promise<void>;
}

const AgentContext = createContext({} as AgentContextType);

const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useViem();
  const { ready, authenticated, getAccessToken, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  const zkSyncSetup = useCallback(async (wallet: ConnectedWallet) => {
    await wallet.switchChain(zkSyncSepoliaTestnet.id);
    const provider = await wallet.getEthereumProvider();

    const walletClient = createWalletClient({
      account: wallet.address as `0x${string}`,
      chain: zkSyncSepoliaTestnet,
      transport: custom(provider),
    }).extend(eip712WalletActions());
    setWallet(wallet);
    setWalletClient(walletClient);
  }, []);

  const getAccountAddress = useCallback(async (): Promise<`0x${string}`> => {
    if (!client) {
      throw new Error("Client not found");
    }

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    return await client.readContract({
      address: AGENT_REGISTRY,
      abi: AgentRegistryAbi,
      functionName: "agentToAccount",
      args: [wallet.address as `0x${string}`],
    });
  }, [client, wallet]);

  const { data: account, isLoading: isAccountQuerying } = useQuery({
    queryKey: ["account"],
    queryFn: getAccountAddress,
    enabled: !!client && !!wallet,
    refetchInterval: 5000,
  });

  const register = useCallback(
    async (sessionId: string, portraitId: bigint) => {
      if (!client) {
        throw new Error("Client not found");
      }

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      if (account && !isZeroAddress(account)) {
        throw new Error("Agent already registered");
      }

      const token = await getAccessToken();

      if (!token) {
        throw new Error("Token not found");
      }

      await registerAgent(
        wallet.address as `0x${string}`,
        portraitId,
        sessionId,
        token
      );
    },
    [client, wallet, account]
  );

  useEffect(() => {
    if (ready && authenticated) {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (embeddedWallet) {
        console.log("Embedded wallet found");
        zkSyncSetup(embeddedWallet);
      }
    }
  }, [wallets]);

  return (
    <AgentContext.Provider
      value={{
        ready,
        authenticated,
        getAccessToken,
        login,
        logout,
        isLoading: isAccountQuerying,
        wallet,
        walletClient,
        account,
        register,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export { AgentContext, AgentProvider };

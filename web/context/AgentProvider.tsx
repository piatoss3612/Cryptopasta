import { useViem } from "@/hooks";
import { AgentRegistryAbi } from "@/libs/abis";
import { AGENT_REGISTRY } from "@/libs/constant";
import { isZeroAddress } from "@/libs/utils";
import { ConnectedWallet, usePrivy, useWallets } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
  register: (
    portraitId: bigint
  ) => Promise<ReadableStreamDefaultReader<Uint8Array>>;
}

const AgentContext = createContext({} as AgentContextType);

const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useViem();
  const { ready, authenticated, getAccessToken, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const navigator = useRouter();

  const handleLogout = useCallback(async () => {
    await logout();
    navigator.push("/");
  });

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
    async (
      portraitId: bigint
    ): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
      if (!client) {
        throw new Error("Client not found");
      }

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      if (account && !isZeroAddress(account)) {
        throw new Error("Agent already registered");
      }

      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("Token not found");
      }

      const body = JSON.stringify({
        agent_address: wallet.address,
        portrait_id: portraitId.toString(),
      });

      const response = await fetch("http://localhost:8080/agent", {
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to register agent");
      }

      return response.body.getReader();
    },
    [client, wallet, account]
  );

  useEffect(() => {
    if (ready && authenticated) {
      const embeddedWallet = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (embeddedWallet) {
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
        logout: handleLogout,
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

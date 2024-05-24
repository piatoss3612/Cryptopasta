import { getTokenMetadata } from "@/actions";
import { useViem } from "@/hooks";
import { AgentRegistryAbi, AgentTokenAbi } from "@/libs/abis";
import { AGENT_REGISTRY, AGENT_TOKEN } from "@/libs/constant";
import { isZeroAddress, loadImage } from "@/libs/utils";
import { AgentRegisterResponse } from "@/types";
import {
  ConnectedWallet,
  usePrivy,
  useWallets,
  useMfaEnrollment,
  Wallet,
} from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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
  showMfaEnrollmentModal: () => void;
  setWalletPassword: () => Promise<Wallet>;
  wallet: ConnectedWallet | null;
  walletClient: WalletClient | null;
  account: `0x${string}` | undefined;
  avatar: string;
  getAgentURI: (account: `0x${string}`) => Promise<string>;
  register: (portraitId: bigint) => Promise<AgentRegisterResponse>;
}

const AgentContext = createContext({} as AgentContextType);

const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useViem();
  const {
    ready,
    authenticated,
    getAccessToken,
    user,
    login,
    logout,
    setWalletPassword,
  } = usePrivy();
  const { wallets } = useWallets();
  const { showMfaEnrollmentModal } = useMfaEnrollment();
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [avatar, setAvatar] = useState<string>("");
  const navigator = useRouter();

  const handleLogout = useCallback(async () => {
    await logout();
    navigator.push("/");
  }, [navigator, logout]);

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

  const getAccountTokenId = useCallback(
    async (account: `0x${string}`): Promise<bigint> => {
      if (!client) {
        throw new Error("Client not found");
      }

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      return await client.readContract({
        address: AGENT_REGISTRY,
        abi: AgentRegistryAbi,
        functionName: "accountToTokenId",
        args: [account],
      });
    },
    [client, wallet]
  );

  const getAgentURI = useCallback(
    async (account: `0x${string}`): Promise<string> => {
      const tokenId = await getAccountTokenId(account);

      return await client.readContract({
        address: AGENT_TOKEN,
        abi: AgentTokenAbi,
        functionName: "tokenURI",
        args: [tokenId],
      });
    },
    [client]
  );

  const { data: account, isLoading: isAccountQuerying } = useQuery({
    queryKey: ["account"],
    queryFn: getAccountAddress,
    enabled: !!client && !!wallet,
    refetchInterval: 5000,
  });

  const { data: portrait } = useQuery({
    queryKey: ["portrait"],
    queryFn: async () => {
      return await getAgentURI(account!);
    },
    enabled: !!client && !!wallet && !!account,
    refetchInterval: 5000,
  });

  const { data: metadata } = useQuery({
    queryKey: ["tokenMetadata"],
    queryFn: async () => getTokenMetadata(portrait!),
    enabled: !!portrait,
    refetchInterval: 5000,
  });

  const register = useCallback(
    async (portraitId: bigint): Promise<AgentRegisterResponse> => {
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

      const response = await axios.post<AgentRegisterResponse>(
        "http://localhost:8080/agent",
        {
          agent_address: wallet.address,
          portrait_id: portraitId.toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 201) {
        throw new Error("Failed to register agent");
      }

      return response.data;
    },
    [client, wallet, account]
  );

  useEffect(() => {
    if (ready && authenticated) {
      const embeddedWallet: ConnectedWallet | undefined = wallets.find(
        (wallet) => wallet.walletClientType === "privy"
      );
      if (embeddedWallet) {
        zkSyncSetup(embeddedWallet);
      }
    }
  }, [ready, authenticated, wallets]);

  useEffect(() => {
    if (metadata) {
      loadImage(metadata.image)
        .then((blob) => {
          setAvatar(blob);
        })
        .catch((err) => console.error(err));
    }
  }, [metadata]);

  return (
    <AgentContext.Provider
      value={{
        ready,
        authenticated,
        getAccessToken,
        login,
        logout: handleLogout,
        showMfaEnrollmentModal,
        setWalletPassword,
        isLoading: isAccountQuerying,
        wallet,
        walletClient,
        account,
        register,
        avatar,
        getAgentURI,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};

export { AgentContext, AgentProvider };

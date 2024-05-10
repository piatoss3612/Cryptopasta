import { useAgent, usePaymaster, useViem } from "@/hooks";
import { AgentAccountAbi, MockUSDTAbi } from "@/libs/abis";
import { AGENT_PAYMASTER, MOCK_USDT } from "@/libs/constant";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { encodeFunctionData } from "viem";
import {
  eip712WalletActions,
  getGeneralPaymasterInput,
  zkSyncSepoliaTestnet,
} from "viem/zksync";
import { utils } from "zksync-ethers";

const Demo = () => {
  const { client } = useViem();
  const { wallet, walletClient, getAccessToken, account } = useAgent();
  const { getPaymasterParams, getDailyTxCount } = usePaymaster();
  const [resp, setResp] = useState("");
  const [hash, setHash] = useState<string>("");
  const [signedMessage, setSignedMessage] = useState<string>("");

  const { data: dailyTxCount } = useQuery({
    queryKey: ["dailyTxCount"],
    queryFn: async () => getDailyTxCount(account as `0x${string}`),
    enabled: !!account,
  });

  const sendRequest = async () => {
    const token = await getAccessToken();
    const response = await axios.get("http://localhost:8080/temp", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setResp(response.data);
    }
  };

  const signMessage = async () => {
    if (!walletClient) {
      throw new Error("Wallet not initialized");
    }

    const signed = await walletClient.signMessage({
      account: wallet?.address as `0x${string}`,
      message: "Hello World",
    });

    setSignedMessage(signed);
  };

  const getFaucet = async () => {
    if (!client) {
      throw new Error("Wallet not initialized");
    }

    if (!walletClient) {
      throw new Error("Wallet not initialized");
    }

    if (!account) {
      throw new Error("Account not initialized");
    }

    const zkClient = walletClient.extend(eip712WalletActions());

    const gasPrice = await client.getGasPrice();

    const hash = await zkClient.writeContract({
      account: account as `0x${string}`,
      address: MOCK_USDT,
      abi: MockUSDTAbi,
      functionName: "faucet",
      gas: BigInt(500000),
      maxFeePerGas: gasPrice,
      ...getPaymasterParams(),
    });

    setHash(hash);
  };

  return (
    <Stack
      spacing={4}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Button onClick={signMessage}>Sign</Button>
      {signedMessage && <Text>{signedMessage}</Text>}
      <Button onClick={sendRequest}>Request</Button>
      {resp && <Text>{resp}</Text>}
      <Button onClick={getFaucet}>Faucet</Button>
      {dailyTxCount && <Text>{dailyTxCount.toString()}</Text>}
      {hash && <Text>{hash}</Text>}
    </Stack>
  );
};

export default Demo;

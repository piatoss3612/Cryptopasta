import { useAgent, useViem } from "@/hooks";
import { Button, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

const Demo = () => {
  const { client } = useViem();
  const { wallet, walletClient, getAccessToken } = useAgent();
  const [resp, setResp] = useState("");
  const [signedMessage, setSignedMessage] = useState<string>("");

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
    </Stack>
  );
};

export default Demo;

"use client";

import { useAgent } from "@/hooks";
import { Button, Spinner, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { isZeroAddress } from "@/libs/utils";

const Main = () => {
  const { ready, isLoading, authenticated, getAccessToken, account } =
    useAgent();
  const [resp, setResp] = useState("");

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

  if (!ready || isLoading || !account) {
    return <Spinner thickness="4px" size="xl" />;
  }

  if (!authenticated) {
    return <Login />;
  }

  if (account && isZeroAddress(account)) {
    return <Register />;
  }

  return (
    <Stack
      spacing={4}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Button onClick={sendRequest}>Request</Button>
      {resp && <Text>{resp}</Text>}
    </Stack>
  );
};

export default Main;

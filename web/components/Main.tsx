"use client";

import { Button, Stack, Text } from "@chakra-ui/react";
import { usePrivy } from "@privy-io/react-auth";
import axios from "axios";
import { useState } from "react";

const Main = () => {
  const { ready, authenticated, getAccessToken, login, logout } = usePrivy();
  const [resp, setResp] = useState("");

  const sendRequest = async () => {
    const token = await getAccessToken();
    const response = await axios.get("http://localhost:8080/v1/temp", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      setResp(response.data);
    }
  };

  if (!authenticated) {
    return (
      <Button onClick={login} isLoading={!ready}>
        Login
      </Button>
    );
  }

  return (
    <Stack
      spacing={4}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Button onClick={logout} isLoading={!ready}>
        Logout
      </Button>
      <Button onClick={sendRequest}>Request</Button>
      {resp && <Text>{resp}</Text>}
    </Stack>
  );
};

export default Main;

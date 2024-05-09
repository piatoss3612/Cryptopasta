"use client";

import { useAgent } from "@/hooks";
import { Button, Spinner, Stack, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import Login from "./Login";
import Register from "../register";
import { isZeroAddress } from "@/libs/utils";
import { useRouter } from "next/navigation";

const Main = () => {
  const { ready, isLoading, authenticated, getAccessToken, account } =
    useAgent();
  const navigator = useRouter();
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

  if (!ready || isLoading) {
    return <Spinner thickness="4px" size="xl" />;
  }

  if (!authenticated) {
    return <Login />;
  }

  if (account && isZeroAddress(account)) {
    navigator.push("/register");
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

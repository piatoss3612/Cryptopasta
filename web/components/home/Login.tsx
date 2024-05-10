import { useAgent } from "@/hooks";
import { Button, Center, Heading } from "@chakra-ui/react";
import React from "react";
import Typist from "react-typist";

const Login = () => {
  const { login } = useAgent();
  return (
    <Center display="flex" flexDirection="column" gap={4}>
      <Typist
        cursor={{
          show: false,
        }}
      >
        <Heading fontFamily={""} size="2xl">
          Cryptopasta
        </Heading>
      </Typist>
      <Button onClick={login} mt={8}>
        Login
      </Button>
    </Center>
  );
};

export default Login;

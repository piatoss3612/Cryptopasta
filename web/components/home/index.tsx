"use client";

import { useAgent } from "@/hooks";
import { Spinner } from "@chakra-ui/react";
import Login from "./Login";
import { isZeroAddress } from "@/libs/utils";
import { useRouter } from "next/navigation";
import Channels from "./Channels";

const Main = () => {
  const { ready, authenticated, account } = useAgent();
  const navigator = useRouter();

  if (!ready) {
    return <Spinner thickness="4px" size="xl" />;
  }

  if (!authenticated) {
    return <Login />;
  }

  if (account && isZeroAddress(account)) {
    navigator.push("/register");
  }

  return <Channels />;
};

export default Main;

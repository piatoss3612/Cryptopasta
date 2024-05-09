"use client";

import { useAgent } from "@/hooks";
import { Spinner } from "@chakra-ui/react";
import Login from "./Login";
import { isZeroAddress } from "@/libs/utils";
import { useRouter } from "next/navigation";
import Demo from "./Demo";

const Main = () => {
  const { ready, isLoading, authenticated, account } = useAgent();
  const navigator = useRouter();

  if (!ready || isLoading) {
    return <Spinner thickness="4px" size="xl" />;
  }

  if (!authenticated) {
    return <Login />;
  }

  if (account && isZeroAddress(account)) {
    navigator.push("/register");
  }

  return <Demo />;
};

export default Main;

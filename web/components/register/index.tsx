"use client";

import { Button, Center, Heading, useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import RegisterModal from "./RegisterModal";
import Portraits from "./Portraits";
import { useAgent } from "@/hooks";
import { useRouter } from "next/navigation";
import { isZeroAddress } from "@/libs/utils";

const Register = () => {
  const { authenticated, account } = useAgent();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [portraitId, setPortraitId] = useState<bigint | null>(null);
  const navigator = useRouter();

  if (!authenticated) {
    navigator.push("/");
  }

  if (account && !isZeroAddress(account)) {
    navigator.push("/");
  }

  return (
    <Center display="flex" flexDirection="column" gap={4}>
      <Heading fontFamily={""}>Select Your Agent</Heading>
      <Portraits portraitId={portraitId} setPortraitId={setPortraitId} />
      <Button
        onClick={onOpen}
        bg={"antiFlashWhite.500"}
        isDisabled={portraitId === null}
        size={"lg"}
      >
        Register
      </Button>
      {isOpen && portraitId !== null && (
        <RegisterModal
          isOpen={isOpen}
          onClose={onClose}
          portraitId={portraitId}
        />
      )}
    </Center>
  );
};

export default Register;

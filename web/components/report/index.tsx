"use client";

import { useAgent, usePayment, useViem } from "@/hooks";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Progress,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Form1 from "./Form1";
import Form2 from "./Form2";
import Preview from "./Preview";
import { encodeMulticalldata, isZeroAddress } from "@/libs/utils";
import { MissionBoardAbi, MockUSDTAbi } from "@/libs/abis";
import { useQuery } from "@tanstack/react-query";
import { MISSION_BOARD, MOCK_USDT } from "@/libs/constant";
import { PaymentMethod, TransactionRequest } from "@/types";
import { pinFileToIPFS, pinJsonToIPFS } from "@/actions";
import { encodeFunctionData, formatUnits } from "viem";

interface Form1Data {
  title: string;
  description: string;
  price: number;
}

interface Form2Data {
  image: File | null;
  preview: string | ArrayBuffer | null;
}

const initialForm1: Form1Data = {
  title: "",
  description: `
  ## Game Title

  ### 1. The setting of the game
  
  ### 2. Characters, items, and enemies in the game
  
  ### 3. Events and challenges the player will face
  
  ### 4. The player's goal
  
  ### 5. (optional) Hints or tips for the player
  
  ### 6. (optional) References to external resources for additional context`,
  price: 0,
};

const Report = () => {
  const TOTAL_STEPS = 3;
  const { client } = useViem();
  const { authenticated, account, getAccessToken, walletClient } = useAgent();
  const { onOpenPayment } = usePayment();
  const navigator = useRouter();
  const toast = useToast();

  // common state
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState((1 / TOTAL_STEPS) * 100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isLastStep = step === TOTAL_STEPS;

  // payment method
  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(parseInt(value) as PaymentMethod);
  };

  // form1 state
  const [form1, setForm1] = useState<Form1Data>(initialForm1);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm1({ ...form1, title: event.target.value });

  const handleDescriptionChange = (value?: string) =>
    setForm1({ ...form1, description: value || "" });

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm1({ ...form1, price: parseFloat(event.target.value) });

  const validateForm1 = () => {
    if (!form1.title || !form1.description || form1.price < 0) {
      toastError("Invalid form data", "Please fill in all fields");
      return false;
    }
    return true;
  };

  // form2 state
  const [form2, setForm2] = useState<Form2Data>({
    image: null,
    preview: null,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        toastError("File too large", "Please upload a file less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setForm2({ ...form2, image: file, preview: reader.result });
      };

      reader.readAsDataURL(file);
    } else {
      setForm2({ ...form2, image: null, preview: null });
    }
  };

  const validateForm2 = () => {
    if (!form2.image) {
      toastError("Invalid form data", "Please upload an image");
      return false;
    }
    return true;
  };

  const validateForm = (step: number) => {
    if (step === 1) return validateForm1();
    if (step === 2) return validateForm2();
    return validateForm1() && validateForm2();
  };

  const geReportingCostInETH = async (): Promise<readonly [bigint, number]> => {
    if (!client) {
      throw new Error("Client is not initialized");
    }

    return await client.readContract({
      address: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "reportingCostInETH",
    });
  };

  const getReportingCostInUSDT = async (): Promise<
    readonly [bigint, number]
  > => {
    if (!client) {
      throw new Error("Client is not initialized");
    }

    return await client.readContract({
      address: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "reportingCostInUSDT",
    });
  };

  const getHasFreeTrial = async (): Promise<boolean> => {
    if (!client) {
      throw new Error("Client is not initialized");
    }

    if (!account || isZeroAddress(account)) {
      return false;
    }

    return await client.readContract({
      address: MISSION_BOARD,
      abi: MissionBoardAbi,
      functionName: "hasFreeTrial",
      args: [account as `0x${string}`],
    });
  };

  const { data: hasFreeTrialData } = useQuery({
    queryKey: ["hasFreeTrial"],
    queryFn: getHasFreeTrial,
    enabled: !!client,
    refetchInterval: 30000,
  });

  const hasFreeTrial = hasFreeTrialData || false;

  const { data: reportingCostInETHData } = useQuery({
    queryKey: ["reportingCostInETH"],
    queryFn: geReportingCostInETH,
    enabled: !!client,
    refetchInterval: 30000,
  });

  const { data: reportingCostInUSDTData } = useQuery({
    queryKey: ["reportingCostInUSDT"],
    queryFn: getReportingCostInUSDT,
    enabled: !!client,
    refetchInterval: 30000,
  });

  const reportingCostInETH = reportingCostInETHData
    ? parseFloat(
        formatUnits(reportingCostInETHData[0], reportingCostInETHData[1])
      )
    : 0;
  const reportingCostInUSDT = reportingCostInUSDTData
    ? parseFloat(
        formatUnits(reportingCostInUSDTData[0], reportingCostInUSDTData[1])
      )
    : 0;

  const handleBack = () => {
    setStep(step - 1);
    setProgress(((step - 1) / TOTAL_STEPS) * 100);
  };

  const handleNext = () => {
    if (!validateForm(step)) return;
    setStep(step + 1);
    setProgress(((step + 1) / TOTAL_STEPS) * 100);
  };

  const [imageUri, setImageUri] = useState<string>("");
  const [tokenUri, setTokenUri] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm(step)) return;

    try {
      setIsLoading(true);
      setMessage("Submitting report...");

      const accessToken = await getAccessToken();

      if (!accessToken) {
        throw new Error("Failed to get access token");
      }

      // pin image to IPFS
      let imageUri_ = imageUri;
      if (!imageUri_) {
        setMessage("Pinning image to IPFS...");
        const imageResponse = await pinFileToIPFS(form2.image!, accessToken);
        imageUri_ = `https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/${imageResponse.IpfsHash}`;
        setImageUri(imageUri_);
      }

      // pin token metadata to IPFS
      let tokenUri_ = tokenUri;
      if (!tokenUri_) {
        setMessage("Pinning token metadata to IPFS...");
        const tokenResponse = await pinJsonToIPFS(
          form1.title,
          form1.description,
          imageUri_,
          accessToken
        );
        tokenUri_ = `https://scarlet-implicit-seahorse-694.mypinata.cloud/ipfs/${tokenResponse.IpfsHash}`;
        setTokenUri(tokenUri_);
      }

      console.log("imageUri", imageUri_);

      // prepare payment
      setMessage("Preparing payment...");

      const usdAmount = BigInt(form1.price * 10 ** 6);

      let params: TransactionRequest;

      if (paymentMethod.valueOf() === 0) {
        // ETH
        params = {
          from: account as `0x${string}`,
          to: MISSION_BOARD as `0x${string}`,
          abi: MissionBoardAbi,
          functionName: "createReport",
          args: [form1.title, tokenUri_, usdAmount, 0],
          gas: BigInt(10000000),
          value: hasFreeTrial ? BigInt(0) : reportingCostInETHData![0],
        } as TransactionRequest;
      } else if (paymentMethod.valueOf() === 1) {
        // USDT
        // 1. approve USDT
        const approveData = encodeFunctionData({
          abi: MockUSDTAbi,
          functionName: "approve",
          args: [MISSION_BOARD, reportingCostInUSDTData![0]],
        });

        // 2. report discovery
        const reportData = encodeFunctionData({
          abi: MissionBoardAbi,
          functionName: "createReport",
          args: [form1.title, tokenUri_, usdAmount, 1],
        });

        const targets: `0x${string}`[] = [MOCK_USDT, MISSION_BOARD];
        const calldatas: `0x${string}`[] = [approveData, reportData];
        const values: bigint[] = [BigInt(0), BigInt(0)];
        const data = encodeMulticalldata(targets, calldatas, values);

        // multicall params
        params = {
          from: account as `0x${string}`,
          to: account as `0x${string}`,
          isMulticall: true,
          multicallData: data,
          gas: BigInt(10000000),
        };
      } else {
        throw new Error("Invalid payment method");
      }

      const callback = () => {
        navigator.push("/");
      };

      onOpenPayment("Create Report", params, callback);
    } catch (error) {
      const errorMessage = (error as Error).message || "Unknown error";
      toastError("Failed to submit report", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toastError = (title: string, description: string) => {
    toast({
      title: title,
      description: description,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!authenticated) {
    navigator.push("/");
    return null;
  }

  if (isZeroAddress(account)) {
    navigator.push("/agent/register");
    return null;
  }

  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      p={6}
      m="10px auto"
      w={["88%", "80%", "60%"]}
      as="form"
      onSubmit={handleSubmit}
    >
      <Progress hasStripe value={progress} mb={4} isAnimated></Progress>
      {step === 1 && (
        <Form1
          title={form1.title}
          description={form1.description}
          price={form1.price}
          handleTitleChange={handleTitleChange}
          handleDescriptionChange={handleDescriptionChange}
          handlePriceChange={handlePriceChange}
        />
      )}
      {step === 2 && (
        <Form2 preview={form2.preview} handleImageUpload={handleImageUpload} />
      )}
      {isLastStep && (
        <Preview
          title={form1.title}
          description={form1.description}
          price={form1.price}
          preview={form2.preview}
          reportingCostInETH={reportingCostInETH}
          reportingCostInUSDT={reportingCostInUSDT}
          paymentMethod={paymentMethod}
          hasFreeTrial={hasFreeTrial}
          handlePaymentMethodChange={handlePaymentMethodChange}
        />
      )}
      <ButtonGroup mt={4} w="100%">
        <Stack
          w="100%"
          direction={{ base: "column", md: "row" }}
          justifyContent={{ base: "center", md: "space-between" }}
          gap={4}
        >
          <Flex justifyContent={{ base: "center", md: "space-between" }}>
            <Button
              onClick={handleBack}
              isDisabled={step === 1 || isLoading}
              bg="white"
              variant="solid"
              w={{ base: "100%", md: "7rem" }}
              mr="5%"
            >
              Back
            </Button>
            <Button
              w={{ base: "100%", md: "7rem" }}
              isDisabled={isLastStep || isLoading}
              onClick={handleNext}
              bg="white"
              variant="solid"
            >
              Next
            </Button>
          </Flex>
          {isLastStep ? (
            <Flex justifyContent={{ base: "end", md: "space-between" }}>
              <Button
                w={{ base: "100%", md: "7rem" }}
                colorScheme="green"
                variant="solid"
                type="submit"
                isDisabled={isLoading}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </Flex>
          ) : null}
        </Stack>
      </ButtonGroup>
    </Box>
  );
};

export default Report;

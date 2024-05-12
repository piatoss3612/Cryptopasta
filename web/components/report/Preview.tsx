import React from "react";
import {
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Center,
  Divider,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import MDEditor from "@uiw/react-md-editor";

interface PreviewProps {
  title: string;
  description: string;
  price: number;
  preview: string | ArrayBuffer | null;
  reportingCostInETH: number;
  reportingCostInUSDT: number;
  paymentMethod: number;
  handlePaymentMethodChange: (value: string) => void;
}

const Preview = ({
  title,
  description,
  price,
  preview,
  reportingCostInETH,
  reportingCostInUSDT,
  paymentMethod,
  handlePaymentMethodChange,
}: PreviewProps) => {
  return (
    <VStack spacing={6} align="stretch" my={4}>
      <Heading as="h3" size="lg" fontFamily={""}>
        Preview
      </Heading>
      <HStack justify="space-between">
        <Text fontSize={"lg"} fontWeight="bold">
          Title:
        </Text>
        <Text fontSize={"lg"}>{title}</Text>
      </HStack>
      <Text fontSize={"lg"} fontWeight="bold">
        Description:
      </Text>
      <MDEditor.Markdown
        source={description}
        style={{
          padding: "0.8rem",
          borderRadius: "0.25rem",
        }}
      />

      <HStack justify="space-between">
        <Text fontSize={"lg"} fontWeight="bold">
          Price:
        </Text>
        <Text fontSize={"lg"}>{`${price} USD`}</Text>
      </HStack>
      {preview && (
        <>
          <Text fontSize={"lg"} fontWeight="bold">
            Image:
          </Text>
          <Center>
            <Image
              src={preview as string}
              alt="Preview image"
              maxW="300px"
              maxH="300px"
            />
          </Center>
        </>
      )}
      <HStack justify="space-between">
        <Text fontSize={"lg"} fontWeight="bold">
          Reporting Cost in ETH:
        </Text>
        <Text fontSize={"lg"}>{`${reportingCostInETH} ETH`}</Text>
      </HStack>
      <HStack justify="space-between">
        <Text fontSize={"lg"} fontWeight="bold">
          Reporting Cost in USDT:
        </Text>
        <Text fontSize={"lg"}>{`${reportingCostInUSDT} USDT`}</Text>
      </HStack>
      <HStack justify="space-between">
        <Text fontSize={"lg"} fontWeight="bold">
          Choose Payment Method:
        </Text>
        <RadioGroup
          value={paymentMethod.toString()}
          onChange={handlePaymentMethodChange}
        >
          <HStack>
            <Radio value="0">ETH</Radio>
            <Radio value="1">USDT</Radio>
          </HStack>
        </RadioGroup>
      </HStack>
    </VStack>
  );
};

export default Preview;

import { HStack, Text } from "@chakra-ui/react";
import React from "react";

const InfoLine = ({
  left,
  right,
}: {
  left: string | JSX.Element;
  right: string | JSX.Element;
}): JSX.Element => (
  <HStack spacing={4} justify="space-between" w={"100%"}>
    <Text fontSize={"lg"}>{left}</Text>
    <Text fontSize={"lg"}>{right}</Text>
  </HStack>
);

export default InfoLine;

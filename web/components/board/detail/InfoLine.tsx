import { Flex, HStack, Text } from "@chakra-ui/react";
import React from "react";

const InfoLine = ({
  left,
  right,
}: {
  left: string | JSX.Element;
  right: string | JSX.Element;
}): JSX.Element => (
  <Flex justify="space-between" align="center">
    <Text fontWeight="semibold">{left}</Text>
    <Text>{right}</Text>
  </Flex>
);

export default InfoLine;

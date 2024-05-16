import {
  Button,
  ButtonGroup,
  Center,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import InfoLine from "./InfoLine";
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  SmallCloseIcon,
  WarningIcon,
} from "@chakra-ui/icons";

interface PaymentModalProps {
  onClose: () => void;
  isOpen: boolean;
  isLoading: boolean;
  useApproval: boolean;
  toggleUseApproval: () => void;
  allowanceAmount: string;
  txHash: string;
  requestName: string;
  gasEstimateInETH: string;
  gasPriceInETH: string;
  dailyTxCount: string;
  maxTxsPerDay: string;
  canResetDailyTxCount: boolean;
  totalCostInETH: string;
  canUsePaymaster: boolean;
  txStatus: string;
  confirmPayment: () => void;
}

const PaymentModal = ({
  onClose,
  isOpen,
  isLoading,
  useApproval,
  toggleUseApproval,
  allowanceAmount,
  txHash,
  requestName,
  gasEstimateInETH,
  gasPriceInETH,
  dailyTxCount,
  maxTxsPerDay,
  canResetDailyTxCount,
  totalCostInETH,
  canUsePaymaster,
  txStatus,
  confirmPayment,
}: PaymentModalProps) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      motionPreset="slideInBottom"
      size={{ base: "md", md: "lg" }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment Details</ModalHeader>
        <ModalCloseButton onClick={onClose} />
        {isLoading && (
          <ModalBody>
            <Center m={12}>
              <Stack spacing={8} justify="center" align="center">
                <Spinner thickness="4px" size="lg" />
                <Text>Processing...</Text>
              </Stack>
            </Center>
          </ModalBody>
        )}
        {!isLoading && !txHash && (
          <>
            <ModalBody bg={"gray.100"} mx={6} rounded={"md"}>
              <Stack m={4} spacing={4} justify="center" align="center">
                <InfoLine left="Transaction:" right={requestName} />
                <InfoLine
                  left="Transaction Fee:"
                  right={`${gasEstimateInETH} ETH`}
                />
                <InfoLine left="Gas Price:" right={`${gasPriceInETH} ETH`} />

                <InfoLine
                  left="Paymaster Limit:"
                  right={`${dailyTxCount}/${maxTxsPerDay}`}
                />
                <InfoLine
                  left="Can Reset Limit:"
                  right={
                    canResetDailyTxCount ? (
                      <CheckCircleIcon color="green" />
                    ) : (
                      <SmallCloseIcon color="red" />
                    )
                  }
                />
                <Divider />
                <InfoLine
                  left="Estimated Cost:"
                  right={`${totalCostInETH} ETH`}
                />
                {canUsePaymaster && !useApproval && (
                  <InfoLine left="Paymaster Discount:" right={"- 100%"} />
                )}
                {useApproval && (
                  <>
                    <InfoLine
                      left="USDT Allowance:"
                      right={
                        allowanceAmount !== "0" ? "Approved" : "Not Approved"
                      }
                    />
                    <InfoLine left="Sponsor Rate:" right={"5%"} />
                  </>
                )}
                <Divider />
                <InfoLine
                  left="Total Cost:"
                  right={`${
                    canUsePaymaster && !useApproval ? "0" : totalCostInETH
                  } ETH`}
                />
              </Stack>
            </ModalBody>
            <ModalFooter display="flex" justifyContent="center">
              <ButtonGroup width={"100%"}>
                <Button
                  colorScheme="blue"
                  onClick={toggleUseApproval}
                  width={"100%"}
                  leftIcon={useApproval ? <CheckCircleIcon /> : <></>}
                >
                  Pay in USDT
                </Button>
                <Button
                  colorScheme="green"
                  onClick={confirmPayment}
                  width={"100%"}
                  isDisabled={useApproval && allowanceAmount === "0"}
                >
                  Confirm
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </>
        )}
        {!isLoading && txHash && (
          <>
            <ModalBody>
              <Center m={4}>
                <Stack spacing={4} justify="center" align="center">
                  {txStatus === "success" ? (
                    <>
                      <CheckCircleIcon
                        name="check-circle"
                        color="green.500"
                        boxSize={"2.4rem"}
                      />
                      <Text>Transaction Succeeded</Text>
                    </>
                  ) : (
                    <>
                      <WarningIcon
                        name="warning"
                        color="red.500"
                        boxSize={"2.4rem"}
                      />
                      <Text>Transaction Reverted</Text>
                    </>
                  )}

                  <Link
                    href={`https://sepolia.explorer.zksync.io/tx/${txHash}`}
                    isExternal
                  >
                    See on Explorer <ExternalLinkIcon mx="2px" />
                  </Link>
                </Stack>
              </Center>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;

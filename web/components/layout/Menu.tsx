import { useAgent, usePayment } from "@/hooks";
import {
  abbreviateAddress,
  getFaucetParams,
  getPaymasterApprovalParams,
  isZeroAddress,
} from "@/libs/utils";
import {
  Box,
  Button,
  Menu as ChakraMenu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  FaFaucetDrip,
  FaAngleDown,
  FaMagento,
  FaWallet,
} from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";

const Menu = () => {
  const { authenticated, logout, account } = useAgent();
  const { onOpenPayment } = usePayment();
  const navigator = useRouter();

  const handleAgent = () => {
    navigator.push(`/agent/${account?.toString()}`);
  };

  const handlePaymasterApproval = () => {
    if (isZeroAddress(account)) {
      throw new Error("Account not initialized");
    }

    const params = getPaymasterApprovalParams(account as `0x${string}`);

    onOpenPayment("Paymaster USDT Approval", params);
  };

  const handleFaucet = () => {
    if (isZeroAddress(account)) {
      throw new Error("Account not initialized");
    }

    const params = getFaucetParams(account as `0x${string}`);

    onOpenPayment("USDT Faucet", params);
  };

  return (
    <Box>
      {authenticated && (
        <ChakraMenu>
          <MenuButton as={Button} rightIcon={<FaAngleDown />}>
            {abbreviateAddress(account)}
          </MenuButton>
          <MenuList color={"black"}>
            <MenuItem
              icon={<FaMagento />}
              onClick={handleAgent}
              isDisabled={isZeroAddress(account)}
            >
              Agent
            </MenuItem>
            <MenuItem
              icon={<FaWallet />}
              onClick={handlePaymasterApproval}
              isDisabled={isZeroAddress(account)}
            >
              Paymaster
            </MenuItem>
            <MenuItem
              icon={<FaFaucetDrip />}
              isDisabled={isZeroAddress(account)}
              onClick={handleFaucet}
            >
              Faucet
            </MenuItem>
            <MenuItem onClick={logout} icon={<PiSignOut />}>
              Logout
            </MenuItem>
          </MenuList>
        </ChakraMenu>
      )}
    </Box>
  );
};

export default Menu;

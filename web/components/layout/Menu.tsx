import { useAgent, usePayment } from "@/hooks";
import {
  abbreviateAddress,
  getFaucetParams,
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
import { FaFaucetDrip, FaAngleDown, FaMagento } from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";
import { IoMdSettings } from "react-icons/io";

const Menu = () => {
  const { authenticated, logout, account } = useAgent();
  const { onOpenPayment } = usePayment();
  const navigator = useRouter();

  const handleAgent = () => {
    navigator.push(`/agent/${account?.toString()}`);
  };

  const handleSettings = () => {
    navigator.push("/settings");
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
              icon={<FaFaucetDrip />}
              isDisabled={isZeroAddress(account)}
              onClick={handleFaucet}
            >
              Faucet
            </MenuItem>
            <MenuItem icon={<IoMdSettings />} onClick={handleSettings}>
              Settings
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

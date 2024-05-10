import { useAgent } from "@/hooks";
import { abbreviateAddress } from "@/libs/utils";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { FaFaucetDrip } from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";

const AccountMenu = () => {
  const { authenticated, logout, account } = useAgent();

  if (!authenticated) {
    return <></>;
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        {abbreviateAddress(account)}
      </MenuButton>
      <MenuList color={"black"}>
        <MenuGroup title="Profile">
          <MenuItem icon={<FaFaucetDrip />}>Faucet</MenuItem>
          <MenuItem onClick={logout} icon={<PiSignOut />}>
            Logout
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default AccountMenu;

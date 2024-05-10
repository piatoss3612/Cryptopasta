// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AgentPaymaster} from "src/aa/AgentPaymaster.sol";
import {Script, console} from "forge-std/Script.sol";

contract AgentRegistryScript is Script {
    function run() public {
        vm.startBroadcast();

        AgentPaymaster paymaster = new AgentPaymaster(0xC16A43E63fa3D48797025dE4d3e838A9fb9C358c);

        payable(address(paymaster)).transfer(1 ether);

        vm.stopBroadcast();

        console.log("AgentPaymaster: ", address(paymaster));
        console.log("AgentPaymaster balance: ", address(paymaster).balance);
    }

    function fund(address paymaster) public {
        vm.startBroadcast();

        console.log("Sender balance: ", msg.sender.balance);

        (bool success,) = paymaster.call{value: 1 ether}("");
        if (!success) {
            revert("AgentPaymaster funding failed");
        }

        console.log("AgentPaymaster balance: ", paymaster.balance);

        vm.stopBroadcast();
    }

    function withdraw(address payable paymaster) public {
        vm.startBroadcast();

        AgentPaymaster instance = AgentPaymaster(paymaster);
        instance.withdraw(payable(msg.sender));
    }

    function checkBalance(address paymaster) public {
        vm.startBroadcast();
        console.log("AgentPaymaster balance: ", paymaster.balance);
        vm.stopBroadcast();
    }
}

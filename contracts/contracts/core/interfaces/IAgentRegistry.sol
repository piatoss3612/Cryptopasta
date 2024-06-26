// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IAgentRegistry is IERC165 {
    error AgentRegistry__PortraitIndexOutOfBounds(uint256 index);
    error AgentRegistry__AlreadyRegistered(address agent);
    error AgentRegistry__AccountNotAllowed(address account);

    event AgentRegistered(address indexed agent, address indexed account, uint256 indexed tokenId);
    event PortraitAdded(uint256 indexed portraitId, string portrait);

    // getters
    function agentToAccount(address agent) external view returns (address account);
    function accountToAgent(address account) external view returns (address agent);
    function accountToTokenId(address account) external view returns (uint256 tokenId);
    function tokenIdToAccount(uint256 tokenId) external view returns (address account);
    function isRegisteredAgent(address agent) external view returns (bool);
    function isRegisteredAccount(address account) external view returns (bool);
    function portraitCount() external view returns (uint256);
    function portrait(uint256 index) external view returns (string memory);

    // state changing
    function addPortrait(string memory portrait) external;
    function register(address agent, uint256 portraitId) external returns (address account, uint256 tokenId);
}

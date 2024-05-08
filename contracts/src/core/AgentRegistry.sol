// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAgentRegistry} from "./interfaces/IAgentRegistry.sol";
import {Agent} from "../token/Agent.sol";
import {AgentAccountFactory} from "../aa/AgentAccountFactory.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title AgentRegistry
/// @author piatoss
/// @notice A contract to register agents and their accounts
/// @dev The contract is creating zkSync native aa accounts for agents
contract AgentRegistry is IAgentRegistry, Ownable {
    AgentAccountFactory public immutable FACTORY;
    Agent public immutable AGENT_TOKEN;

    string[] private _portraits;

    mapping(address => address) private _agentToAccount;
    mapping(address => address) private _accountToAgent;
    mapping(uint256 => address) private _tokenIdToAccount;
    mapping(address => uint256) private _accountToTokenId;

    constructor(AgentAccountFactory _factory, string[] memory portraits) Ownable(msg.sender) {
        FACTORY = _factory;
        _portraits = portraits;
        AGENT_TOKEN = new Agent();
    }

    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IAgentRegistry).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    /// @notice Returns the account address for the given agent address
    /// @param agent The agent address
    /// @return account The account address
    function agentToAccount(address agent) public view override returns (address account) {
        account = _agentToAccount[agent];
    }

    /// @notice Returns the agent address for the given account address
    /// @param account The account address
    /// @return agent The agent address
    function accountToAgent(address account) public view override returns (address agent) {
        agent = _accountToAgent[account];
    }

    /// @notice Returns the tokenId for the given account address
    /// @param account The account address
    /// @return tokenId The tokenId
    function accountToTokenId(address account) public view returns (uint256 tokenId) {
        tokenId = _accountToTokenId[account];
    }

    /// @notice Returns the account address for the given tokenId
    /// @param tokenId The tokenId
    /// @return account The account address
    function tokenIdToAccount(uint256 tokenId) public view returns (address account) {
        account = _tokenIdToAccount[tokenId];
    }

    /// @notice Returns the tokenId for the given agent address
    /// @param agent The agent address
    /// @return tokenId The tokenId
    function isRegisteredAgent(address agent) public view override returns (bool) {
        return _agentToAccount[agent] != address(0);
    }

    /// @notice Returns true if the account address is registered
    /// @param account The account address
    /// @return bool True if the account address is registered
    function isRegisteredAccount(address account) public view returns (bool) {
        return _accountToAgent[account] != address(0);
    }

    /// @notice Returns the number of portraits
    /// @return count The number of portraits
    function portraitCount() public view override returns (uint256) {
        return _portraits.length;
    }

    /// @notice Returns the portrait for the given index
    /// @param index The index
    /// @return portrait The portrait
    function portrait(uint256 index) public view override returns (string memory) {
        if (index >= _portraits.length) {
            revert AgentRegistry__PortraitIndexOutOfBounds(index);
        }
        return _portraits[index];
    }

    /// @notice Adds a portrait
    /// @dev Only the owner can add a portrait
    /// @param _portrait The portrait
    function addPortrait(string memory _portrait) external override onlyOwner {
        _portraits.push(_portrait);
        emit PortraitAdded(_portraits.length - 1, _portrait);
    }

    /// @notice Registers an agent
    /// @dev Only the owner can register an agent
    /// @param agent The agent address
    /// @param portraitId The portrait index
    /// @return account The account address
    /// @return tokenId The tokenId
    function register(address agent, uint256 portraitId)
        external
        override
        onlyOwner
        returns (address account, uint256 tokenId)
    {
        if (isRegisteredAgent(agent)) {
            revert AgentRegistry__AlreadyRegistered(agent);
        }

        if (isRegisteredAccount(agent)) {
            revert AgentRegistry__AccountNotAllowed(agent);
        }

        if (portraitId >= portraitCount()) {
            revert AgentRegistry__PortraitIndexOutOfBounds(portraitId);
        }

        account = FACTORY.deployAccount(agent);

        string memory selected = portrait(portraitId);
        tokenId = AGENT_TOKEN.mint(account, selected);

        _agentToAccount[agent] = account;
        _accountToAgent[account] = agent;
        _tokenIdToAccount[tokenId] = account;
        _accountToTokenId[account] = tokenId;

        emit AgentRegistered(agent, account, tokenId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAgentRegistry} from "./interfaces/IAgentRegistry.sol";
import {Agent} from "../token/Agent.sol";
import {AgentAccountFactory} from "../aa/AgentAccountFactory.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract AgentRegistry is IAgentRegistry, Ownable {
    AgentAccountFactory public immutable FACTORY;
    Agent public immutable AGENT_TOKEN;

    string[] private _portraits;

    mapping(address => bool) private _registeredAgents;
    mapping(address => bool) private _registeredAccounts;
    mapping(uint256 => address) private _tokenIdToAccount;

    constructor(AgentAccountFactory _factory, string[] memory portraits) Ownable(msg.sender) {
        FACTORY = _factory;
        _portraits = portraits;
        AGENT_TOKEN = new Agent();
    }

    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        return interfaceId == type(IAgentRegistry).interfaceId || interfaceId == type(IERC165).interfaceId;
    }

    function isRegisteredAgent(address agent) public view override returns (bool) {
        return _registeredAgents[agent];
    }

    function isRegisteredAccount(address account) public view returns (bool) {
        return _registeredAccounts[account];
    }

    function portraitCount() public view override returns (uint256) {
        return _portraits.length;
    }

    function portrait(uint256 index) public view override returns (string memory) {
        if (index >= _portraits.length) {
            revert AgentRegistry__PortraitIndexOutOfBounds(index);
        }
        return _portraits[index];
    }

    function addPortrait(string memory _portrait) external override onlyOwner {
        _portraits.push(_portrait);
        emit PortraitAdded(_portraits.length - 1, _portrait);
    }

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

        bytes32 salt = keccak256(abi.encodePacked(agent, portraitId));

        account = FACTORY.deployAccount(salt, agent);

        string memory selected = portrait(portraitId);
        tokenId = AGENT_TOKEN.mint(account, selected);

        _registeredAgents[agent] = true;
        _registeredAccounts[account] = true;
        _tokenIdToAccount[tokenId] = account;

        emit AgentRegistered(agent, account, tokenId);
    }
}

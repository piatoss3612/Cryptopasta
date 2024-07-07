// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC6454} from "./IERC6454.sol";

interface IAgent is IERC721, IERC6454 {
    error Agent__Soulbound();

    event AgentMinted(address indexed account, uint256 indexed tokenId, string uri);

    function mint(address _account, string memory _uri) external returns (uint256 tokenId);
}

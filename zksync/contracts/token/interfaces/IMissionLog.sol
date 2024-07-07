// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IMissionLog is IERC721 {
    error AccountDoesNotOwnAnyAgent();

    function mint(string memory _uri) external returns (uint256 tokenId);
}

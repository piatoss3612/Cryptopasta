// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

interface ICryptopasta is IERC1155 {
    error Cryptopasta__AlreadyExist(uint256 id);
    error Cryptopasta__NotExist(uint256 id);

    event CryptopastaIdentified(uint256 indexed id, string uri);

    function create(uint256 tokenId, string memory uri) external returns (uint256);
    function mint(address account, uint256 id, uint256 amount, bytes memory data) external;
}

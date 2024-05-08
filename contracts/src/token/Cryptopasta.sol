// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ICryptopasta} from "./interfaces/ICryptopasta.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";

/// @title Cryptopasta
/// @author piatoss
/// @notice This contract is an ERC1155 token contract for Cryptopasta.
contract Cryptopasta is ICryptopasta, ERC1155, ERC1155URIStorage, ERC1155Burnable, Ownable {
    string public name = "Cryptopasta";
    string public symbol = "CPASTA";

    constructor() ERC1155("") Ownable(msg.sender) {}

    function supportsInterface(bytes4 interfaceId) public view override(IERC165, ERC1155) returns (bool) {
        return interfaceId == type(ICryptopasta).interfaceId || super.supportsInterface(interfaceId);
    }

    function create(uint256 tokenId, string memory _uri) external onlyOwner returns (uint256) {
        if (_exist(tokenId)) {
            revert Cryptopasta__AlreadyExist(tokenId);
        }
        _setURI(tokenId, _uri);
        emit CryptopastaIdentified(tokenId, _uri);
        return tokenId;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data) external onlyOwner {
        if (!_exist(id)) {
            revert Cryptopasta__NotExist(id);
        }
        _mint(account, id, amount, data);
    }

    function uri(uint256 id) public view override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return super.uri(id);
    }

    function _exist(uint256 id) internal view returns (bool) {
        return bytes(uri(id)).length > 0;
    }
}

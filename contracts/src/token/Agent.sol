// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IAgent} from "./interfaces/IAgent.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Agent is IAgent, ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("Agent", "Agent") Ownable(msg.sender) {}

    function mint(address _account, string memory _uri) external onlyOwner returns (uint256 tokenId) {
        tokenId = _nextTokenId++;
        _mint(_account, tokenId);
        _setTokenURI(tokenId, _uri);

        emit AgentMinted(_account, tokenId, _uri);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(IERC165, ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function isTransferable(uint256 tokenId, address from, address to) public view returns (bool) {
        if (from == address(0x0) && to == address(0x0)) {
            return false;
        }
        // Only allow minting and burning
        if (from == address(0x0) || to == address(0x0)) {
            return true;
        }
        _requireOwned(tokenId);
        return false;
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        if (isTransferable(tokenId, from, to)) {
            return super._update(to, tokenId, auth);
        }

        revert Agent__Soulbound();
    }
}

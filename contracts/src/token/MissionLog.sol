// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IMissionLog} from "./interfaces/IMissionLog.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MissionLog is IMissionLog, ERC721, ERC721URIStorage, Ownable {
    IERC721 public immutable AGENT;

    uint256 private _nextTokenId;

    constructor(address _agent) ERC721("Mission Log", "MSLOG") Ownable(msg.sender) {
        AGENT = IERC721(_agent);
    }

    function mint(string memory _uri) external returns (uint256 tokenId) {
        address account = msg.sender;

        if (AGENT.balanceOf(account) == 0) {
            revert AccountDoesNotOwnAnyAgent();
        }

        tokenId = _nextTokenId++;
        _mint(account, tokenId);
        _setTokenURI(tokenId, _uri);
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
}

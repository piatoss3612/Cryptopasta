// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC6454 { /* is IERC165 */
    /**
     * @notice Used to check whether the given token is transferable or not.
     * @dev If this function returns `false`, the transfer of the token MUST revert execution.
     * @dev If the tokenId does not exist, this method MUST revert execution, unless the token is being checked for
     *  minting.
     * @dev The `from` parameter MAY be used to also validate the approval of the token for transfer, but anyone
     *  interacting with this function SHOULD NOT rely on it as it is not mandated by the proposal.
     * @param tokenId ID of the token being checked
     * @param from Address from which the token is being transferred
     * @param to Address to which the token is being transferred
     * @return Boolean value indicating whether the given token is transferable
     */
    function isTransferable(uint256 tokenId, address from, address to) external view returns (bool);
}

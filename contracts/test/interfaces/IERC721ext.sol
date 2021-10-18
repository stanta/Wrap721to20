// SPDX-License-Identifier:  Apache License
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
 * @dev Required interface of an ERC721 compliant contract.
 */
interface IERC721ext is IERC721 {

    function burn(uint256 tokenId) external ;
    function mint(address to, uint256 tokenId) external ; 
    function totalSupply()  external  view returns (uint256);

}
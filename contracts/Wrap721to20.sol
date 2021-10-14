// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import './WrappedERC721asERC20.sol';


contract Wrap721to20 {

  function wrap( uint256 _totSupply,
                address _collection,
                uint256 _tokenId) public {
    IERC721Metadata nft = IERC721Metadata(_collection);

    string memory nameT = string( abi.encodePacked("w", nft.name(), "_", _tokenId));            
    string memory sT = string( abi.encodePacked("w", nft.symbol()));

    WrappedERC721asERC20 w =  new  WrappedERC721asERC20(nameT, sT);
    w.wrap(_totSupply, _collection, _tokenId, msg.sender);
  }

  function unwrap(address _token) public  returns (uint) {
     WrappedERC721asERC20(_token).unwrap(msg.sender);
  }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import './WrappedERC721asERC20.sol';


contract Wrap721to20 {

address[] public wrapped; 
  function create( 
                address _collection,
                uint256 _tokenId) public returns (address)  {
    IERC721Metadata nft = IERC721Metadata(_collection);

    string memory nameT = string( abi.encodePacked("w", nft.name(), "_", _tokenId));            
    string memory sT = string( abi.encodePacked("w", nft.symbol()));

    WrappedERC721asERC20 w =  new  WrappedERC721asERC20(nameT, sT, _collection, _tokenId);
    return address(w);            
    }
  
  function wrap (uint256 _totSupply, address _wAddr) public {
    WrappedERC721asERC20 w = WrappedERC721asERC20(_wAddr);
    w.wrap(_totSupply,  msg.sender);
    wrapped.push(address(w));
    
  }

  function unwrap(address _token) public   {
     WrappedERC721asERC20(_token).unwrap(msg.sender);
  }

}

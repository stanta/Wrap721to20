// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import './WrappedERC721asERC20.sol';


contract Wrap721to20 {

address[] public wrapped; 
mapping (address=>uint256) nonces;

  event CreatedWrapping (address);
  function create( 
                address _collection,
                uint256 _tokenId) public  {
    IERC721Metadata nft = IERC721Metadata(_collection);
    require(nft.ownerOf(_tokenId) == msg.sender, "Only owner of NFT can wrap it!");

    nonces[_collection] = nonces[_collection]+1;
    string memory nameT = string( abi.encodePacked("w", nft.name(), "_",  nonces[_collection] ));            
    string memory sT = string( abi.encodePacked("w", nft.symbol(), "_",  nonces[_collection] ));

    WrappedERC721asERC20 w =  new  WrappedERC721asERC20(nameT, sT, _collection, _tokenId);
    emit CreatedWrapping(address(w));
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

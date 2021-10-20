// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import './WrappedERC721asERC20.sol';


contract Wrap721to20 {

address[] public wrapped; 
mapping (address => uint)  indexWrapped;

  event CreatedWrapping (address);
  function create( 
                address _collection,
                uint256 _tokenId,
                string calldata _wName,
                string calldata _wSymb) public  {
    IERC721Metadata nft = IERC721Metadata(_collection);
    require(nft.ownerOf(_tokenId) == msg.sender, "Only owner of NFT can wrap it!");

    string memory nameT = string( abi.encodePacked("w", nft.name(), "_",  _wName ));            
    string memory sT = string( abi.encodePacked("w", nft.symbol(), "",  _wSymb ));

    WrappedERC721asERC20 w =  new  WrappedERC721asERC20(nameT, sT, _collection, _tokenId);
    emit CreatedWrapping(address(w));
    }
  
  function wrap (uint256 _totSupply, address _wAddr, address _to) public {
    WrappedERC721asERC20 w = WrappedERC721asERC20(_wAddr);
    w.wrap(_totSupply, _to);
    wrapped.push(address(w));
    indexWrapped[address(w)] = wrapped.length-1;
    
  }

  function unwrap(address _token, address _recepient) public   {
    WrappedERC721asERC20(_token).unwrap(_recepient);
    uint curr = indexWrapped[_token];
    uint wrLen = wrapped.length;
    wrapped[curr] = wrapped[wrLen -1];
    delete (wrapped[wrLen -1]);
  }

  function getAllWrapped() public view returns (address[] memory ) {
    return wrapped;
  }

}

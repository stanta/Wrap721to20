//SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract WrappedERC721asERC20 is ERC20Burnable, IERC721Receiver {
    address public collection;
    uint256 public tokenID;


  constructor ( string memory _name, string memory _symbol,  address _collection, uint256 _tokenID) 
      ERC20( _name, _symbol) {
      collection = _collection;
      tokenID = _tokenID;
    }

    function wrap(uint256 _totSupply,
                address _sender ) public {
        IERC721 nft = IERC721Metadata(collection);
        require(nft.ownerOf(tokenID) == _sender, "Not owner of NFT");
        nft.transferFrom(_sender, address(this), tokenID);
        _mint(_sender, _totSupply);
  
      }

    function unwrap(address _sender) public {
        ERC20Burnable thisT = ERC20Burnable(address(this));
        require(thisT.balanceOf(_sender) == thisT.totalSupply(), "Needs all minted tokens here" );
        IERC721 nft = IERC721Metadata(collection);
        thisT.burnFrom (_sender, thisT.totalSupply());
        nft.transferFrom(address(this), _sender, tokenID);
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory ) {
        return IERC721Metadata(collection).tokenURI(tokenID);
    }



    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)  public override pure returns(bytes4) {
            return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
        }
    
}
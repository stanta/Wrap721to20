//SPDX-License-Identifier: MIT
pragma solidity >=0.8.2;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract WrappedERC721asERC20 is ERC20, IERC721Receiver {
    address public collection;
    uint256 public tokenID;


  constructor ( string memory _name, string memory _symbol) 
      ERC20( _name, _symbol) {

    }

    function wrap(uint256 _totSupply,
                address _collection,
                uint256 _tokenId,
                address _sender ) public {
        IERC721 nft = IERC721(_collection);
        require(nft.ownerOf(_tokenId) == _sender, "Not owner of NFT");
        nft.transferFrom(_sender, address(this), _tokenId);
        _mint(_sender, _totSupply);
        collection = _collection;
        tokenID = tokenID;
      }

    function unwrap(address _sender) public {
        ERC20 thisT = ERC20(address(this));
        require(thisT.balanceOf(_sender) == thisT.totalSupply(), "Needs all minted tokens here" );
        IERC721 nft = IERC721(collection);
        nft.transferFrom(address(this), _sender, tokenID);


    }


    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)  public override pure returns(bytes4) {
            return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
        }
    
}
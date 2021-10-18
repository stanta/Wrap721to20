 
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./interfaces/IERC721ext.sol";

contract ERC721example is ERC721, IERC721ext {
    constructor (string  memory _name, string memory _symbol ) 
        ERC721(_name, _symbol)
    {
        
    }

    /**
    * Custom accessor to create a unique token
    */

    function mint (uint _id) public 
    {
        _mint (msg.sender, _id);
    }

    function mint (address _whom, uint _id) public override
    {
        _mint (_whom, _id);
    }

    function burn (uint _id) public override
    {
        _burn( _id);
    }

    function totalSupply()  external  view override returns  (uint256) {
        
    }
}
//const { assert } = require("console");

const Token721 = artifacts.require('ERC721example.sol');

contract ("WrappedERC721asERC20.sol", accounts => {
    var mp, t721;
    const idNFT = 1234;
    const price = 1000 ;
    const price2 =  2000;

    it ("1. deploy & mint ERC721", async () => { 

        t721 =  await Token721.new( "CryptoPunk1", "CP1");
        await t721.mint(accounts[0], idNFT);
        await t721.mint(accounts[0], idNFT+1);
        await t721.mint(accounts[0], idNFT+2);
       assert (accounts[0] == await t721.ownerOf(idNFT), "accounts[0] !=  t721.ownerOf(idNFT)");
       let fs = require('fs');
        fs.writeFile("./contr.json", JSON.stringify({"ERC721":t721.address, "tokenID":idNFT,  "account": accounts[0]}), function(err) {
          if (err) {
              console.log(err);
          }
      });
   });
})
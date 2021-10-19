import React, { Component } from "react";
import {Form, FormGroup, Input, HelpBlock, Button, FormText} from 'reactstrap';
import Wrap721to20 from "./contracts/Wrap721to20.json";

import IERC721 from "./contracts/ERC721example.json";
import WrappedERC721asERC20 from "./contracts/WrappedERC721asERC20.json";
import getWeb3 from "./getWeb3";
import addChain from "./addChain"

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Wrap721to20.networks[networkId];
      const instance = new web3.eth.Contract(
        Wrap721to20.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, factory: instance, 
          networkId: networkId,
          wrappedName:"unloaded", 
          wrappedSymbol:"unloaded", 
          wrappedTotsupply:"unloaded", 
          wrappedTokenURI:"unloaded", 
          wrappedAddress: "unloaded" ,
          toAddr: accounts[0]
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleChange(e) {
    let keyVal = {}
    keyVal[e.target.name] = e.target.value;
    this.setState( keyVal );
                 
  }
  add2Wallet = async(e) =>{
    const { wrappedSymbol,  wrappedTokenURI, wrappedAddress}= this.state;
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: wrappedAddress, // The address that the token is at.
            symbol: wrappedSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: 18, // The number of decimals in the token
            image: wrappedTokenURI, // A string url of the token logo
          },
        },
      });
    
      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
    
       
  }

  unWrap = async (e) => { 
    try {
      const { accounts, factory,  toAddr, web3,   wrappedAddress } = this.state;
      const erc20Wrapped = new web3.eth.Contract(
        WrappedERC721asERC20.abi,
        wrappedAddress,
      );
      const wrappedTotsuppl=await erc20Wrapped.methods.totalSupply().call()
      const wrappedbalanceOf=await erc20Wrapped.methods.balanceOf(toAddr).call()
      console.log(wrappedTotsuppl, wrappedbalanceOf)
      if (wrappedTotsuppl == wrappedbalanceOf)  { 
        await erc20Wrapped.methods.approve(wrappedAddress, wrappedTotsuppl ).send({ from: accounts[0] }); 
        await factory.methods.unwrap(wrappedAddress, toAddr).send({ from: accounts[0] });
      } else {
        alert(
          `Failed to unwrap: insufficient balance of sender `,
        );
      }   
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to unwrap `,
      );
      console.error(error);
    }
  }
  runWrap = async (e) => {
    try {
    const { accounts, factory, totSupply, collection, tokenId,  web3, toAddr,   wName, wSym } = this.state;
   const erc721 = new web3.eth.Contract(
      IERC721.abi,
      collection,
      { from: accounts[0] }
    );
     const erc721name = erc721.methods.name().call({ from: accounts[0] });
     console.log (erc721name)
    const wrapped =  await factory.methods.create(collection, tokenId, wName, wSym).send({ from: accounts[0] });
    const wrERC20addr = wrapped.events.CreatedWrapping.returnValues[0];
    console.log('wrERC20addr: ', wrERC20addr);
     await erc721.methods.approve( wrERC20addr,tokenId ).send({ from: accounts[0] });
     await factory.methods.wrap(web3.utils.toWei(totSupply), wrERC20addr, toAddr).send({ from: accounts[0] });

  
    // Get the value from the contract to prove it worked.
  //  const response = await contract.methods.get().call();
   // const deployedNetwork = WrappedERC721asERC20.networks[networkId];


    const erc20Wrapped = new web3.eth.Contract(
      WrappedERC721asERC20.abi,
      wrERC20addr,
    );
    const wrappedNam= await erc20Wrapped.methods.name().call()
    const wrappedSymbo= await erc20Wrapped.methods.symbol().call()
    const wrappedTotsuppl=await erc20Wrapped.methods.totalSupply().call()
    const  wrappedTokenUR=await erc20Wrapped.methods.tokenURI(0).call()

    this.setState({ wrappedName: wrappedNam,
                    wrappedSymbol: wrappedSymbo,
                    wrappedTotsupply:wrappedTotsuppl,
                    wrappedTokenURI:wrappedTokenUR,
                    wrappedAddress: wrERC20addr
      });
    
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load `,
      );
      console.error(error);
    }
    // Update state with the result.
  //  this.setState({ storageValue: response });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    const {wrappedName, wrappedSymbol, wrappedTotsupply,  wrappedAddress, toAddr}= this.state;
    return (
      <div className="App">
        <h1>Wrap your NFT ERC721 to ERC20 and trade as usual coin!!</h1>
        <p>Enter ERC721 data:  </p>
        <Form>
                <FormGroup>
                  <Input type = "text"
                    key="collection"
                    name="collection"
                    placeholder="NFT collection address for wrapping"                  
                    onChange={(e) => this.handleChange(e)}/> <br />
                   <Input type = "text"
                    key="tokenId"
                    name="tokenId"
                    placeholder="token ID for wrapping"                  
                    onChange={(e) => this.handleChange(e)}/>
                    <br />

                    <p>Enter wrapped ERC20  token data </p>
                    <Input type = "text"
                    key="wName"
                    name="wName"
                    placeholder="Wrapped additional name"                  
                    onChange={(e) => this.handleChange(e)}/>
                    <br />
                    <Input type = "text"
                    key="wSym"
                    name="wSym"
                    placeholder="Wrapped additional symbol"                  
                    onChange={(e) => this.handleChange(e)}/>
                    <br />

                    <Input type = "text"
                    key="totSupply"
                    name="totSupply"
                    placeholder="TotalSupply"                  
                    onChange={(e) => this.handleChange(e)}/>
                    <br />
                    To:
                    <Input type = "text"
                    key="toAddr"
                    name="toAddr"
                    value = {toAddr}
                    placeholder="Recepient's address"                  
                    onChange={(e) => this.handleChange(e)}/>
                   <br />
                  <Button color="primary" onClick={(e) => this.runWrap(e)}>Wrap it! </Button>

                </FormGroup>
          </Form>
      <Form>
          <h2> Wrapped token:</h2>
      <p>  Wrapped Token name:  {wrappedName}, <br /> symbol: {wrappedSymbol}, <br />Total supply:  {wrappedTotsupply}, <br />Address: {wrappedAddress} </p>
      <Button color="primary" onClick={(e) => this.add2Wallet(e)}>Add to wallet </Button>
      

      </Form>

      <Form>
          <h2> Unwrap token:</h2>
          <Input type = "text"
                    key="wrappedAddress"
                    name="wrappedAddress"
                    placeholder="Wrapped ERC20 Address"                  
                    onChange={(e) => this.handleChange(e)}/>
                    <br />
                    To:
                    <Input type = "text"
                    key="toAddr"
                    name="toAddr"
                    value = {toAddr}
                    placeholder="Recepient's address"                  
                    onChange={(e) => this.handleChange(e)}/>
                   <br />
      <Button color="primary" onClick={(e) => this.unWrap(e)}>Unwrap </Button>
      

      </Form>
      </div>
    );
  }
}

export default App;

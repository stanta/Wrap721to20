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
          wrappedAddress: "unloaded" 
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

  runWrap = async (e) => {
    try {
    const { accounts, factory, totSupply, collection, tokenId, networkId, web3   } = this.state;
   const erc721 = new web3.eth.Contract(
      IERC721.abi,
      collection,
      { from: accounts[0] }
    );
     const erc721name = erc721.methods.name().call({ from: accounts[0] });
     console.log (erc721name)
    const wrapped =  await factory.methods.create(collection, tokenId).send({ from: accounts[0] });
    const wrERC20addr = wrapped.events.CreatedWrapping.returnValues[0];
    console.log('wrERC20addr: ', wrERC20addr);
     await erc721.methods.approve( wrERC20addr,tokenId ).send({ from: accounts[0] });
     await factory.methods.wrap(totSupply, wrERC20addr).send({ from: accounts[0] });

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
                    wrappedAddress: wrapped.address
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
    const {wrappedName, wrappedSymbol, wrappedTotsupply, wrappedTokenURI, wrappedAddress}= this.state;
    return (
      <div className="App">
        <h1>Wrap your NFT ERC721 to ERC20 and trade as usual coin!!</h1>
        <p>Enter ERC721 data: <br />collection address, tokenId <br /> and TotalSupply for ERC20 token</p>
        <Form>
                <FormGroup>
                <FormText color="muted">Enter:</FormText>
                  <Input type = "text"
                    key="collection"
                    name="collection"
                    placeholder="NFT collection address"                  
                    onChange={(e) => this.handleChange(e)}/>
                   <Input type = "text"
                    key="tokenId"
                    name="tokenId"
                    placeholder="token ID "                  
                    onChange={(e) => this.handleChange(e)}/>
                    <Input type = "text"
                    key="totSupply"
                    name="totSupply"
                    placeholder="TotalSupply"                  
                    onChange={(e) => this.handleChange(e)}/>
                    <br />

                  <Button color="primary" onClick={(e) => this.runWrap(e)}>Wrap it! </Button>

                </FormGroup>
          </Form>

          <h2> Wrapped token:</h2>
          {wrappedName}, {wrappedSymbol}, {wrappedTotsupply}, {wrappedTokenURI}, {wrappedAddress}
      </div>
    );
  }
}

export default App;

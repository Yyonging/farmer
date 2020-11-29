import './App.css';
import { Component } from 'react';
import Block from './block';
import Web3 from "web3";

import {SiderDemo, ProcessStatus, TreeList, ShowTree, TransactTrc} from './balances'

class App extends Component {

  componentWillMount() {
    if (window.ethereum) {
      // use MetaMask's provider
      Block.web3 = new Web3(window.ethereum);
      window.ethereum.enable(); // get permission to access accounts
    } else {
      console.warn(
        "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      Block.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
        // new Web3.providers.HttpProvider("http://192.168.8.208:8545"),
      );
    }
    Block.start();
    console.log('enter App componentWillMount');
  }

  render() {
      return (
        <SiderDemo />)
      //   <div className="App">
      //     <h1>基于区块链的果树扶贫应用</h1>
      //     <ProcessStatus></ProcessStatus>
      //     <TreeList></TreeList>
      //     <h3>果树交易</h3>
      //     <ShowTree></ShowTree>
      //     <TransactTrc></TransactTrc>
      //   </div>
      // );
  }

}

export default App;

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
        "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      Block.web3 = new Web3(
        new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
      );
    }
    Block.start();
    console.log('enter App componentWillMount');
  }

  render() {
      return (
        <SiderDemo />)
  }

}

export default App;

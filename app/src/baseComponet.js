import React from 'react';
import Block from './block';
import { message } from 'antd';

class BaseComponent extends React.Component {

    async connect() {
      if (Block.meta === null || Block.auction === null) {
        await Block.start();
      }
    }
  
    async refreshProcess() {
      await this.connect();
      const {getProcess} = Block.auction.methods;
      var res = await getProcess().call();
      console.log("process status:", res)
      this.setState({status:res});
    }
  
    async getHighest(){
      await this.connect()
      const {getBidsHighest} = Block.auction.methods;
      var hightests = await getBidsHighest().call();
      console.log(hightests)
      this.setState({hightests:hightests})
    }
  
    async getTcs(){
      await this.connect()
      const {getTreeCoins} = Block.auction.methods;
      console.log(getTreeCoins);
      var tcs = await getTreeCoins().call();
      console.log(tcs)
      this.setState({tcs:tcs})
    }
  
    async getAddrs() {
      await this.connect()
      const {getBidsAddr} = Block.auction.methods;
      var addrs = await getBidsAddr().call();
      console.log(addrs)
      this.setState({addrs:addrs})
    }
  
    async postBid(number) {
      await this.connect();
      const {bid} = Block.auction.methods;
      var isSucceess = await bid(number).call();
      console.log("bid", isSucceess);
      if (isSucceess)　message.info("竞价成功！");
      else message.info("竞价失败！");    
    }
  
  
  
  
    async refreshStatus() {
      await this.connect();
      const {getStatus} = Block.meta.methods;
      var balanceList = await getStatus().call();
      console.log('refreshStatus: '+ balanceList)
      var newBalanceList = balanceList.map(function(item, index) {return {key:index+1, value:item}});
      this.setState({balanceList:newBalanceList})
    }
  
  
    async refreshBalance() {
      await this.connect()
      const {balanceOf} = Block.meta.methods;
      const balance = await balanceOf(Block.account).call();
      this.setState({balance: balance});
      if (balance !== "0") {
        const { getBalance } = Block.meta.methods;
        const balanceList = await getBalance(Block.account).call();
        console.log(balanceList);
        var balanceListShow = balanceList.filter(item => item!=="0");
        this.setState({balanceList:balanceListShow});
      }
    }
  
    async transfer(receiver, amount) {
      await this.connect();
      this.setState({status:"Initiating transaction... (please wait)"})
      message.info(this.state.status);
      const { transfer } = Block.meta.methods;
      const success = await transfer(receiver, amount).send({ from: Block.account });
      console.log(success);
      this.setState({status:"Transaction complete!"});
      message.info(this.state.status);
    }
  
    async buy(number) {
      await this.connect();
      console.log(number);
      const {buyTrc} = Block.meta.methods;
      const success = await buyTrc(number).send({from: Block.account, value:10**17});
      console.log("buy", success);
    }
  
  }

  export default BaseComponent;
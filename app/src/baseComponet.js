import React from 'react';
import Block from './block';
import { message } from 'antd';
import { ArrowsAltOutlined } from '@ant-design/icons';

class BaseComponent extends React.Component {

    async connect() {
      if (Block.meta === null || Block.auction === null) {
        await Block.start();
      }
    }
  
    async refreshProcess() {
      await this.connect();
      let t = Math.ceil(new Date().valueOf() / 1000);
      const {getProcess} = Block.auction.methods;
      var res = await getProcess(t).call();
      console.log("refreshProcess status:", t, res)
      this.setState({status:Number(res)});
    }
  
    async getHighest() {
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
  
    async postBid(number, value) {
      await this.connect();
      const {bid} = Block.auction.methods;
      var isSucceess = await bid(number).send({from:Block.account, value:value*10**18});
      console.log("bid", isSucceess);
      if (isSucceess)　message.info("竞价成功！");
      else message.info("竞价失败！");    
    }
    
    async getBidInfo() {
      await this.connect();
      const {getBidHighInfo} = Block.auction.methods;
      console.log("account", Block.account);
      var res = await getBidHighInfo().call({from:Block.account});
      this.setState({price: res[0], number:res[1], host:res[2], account:res[3]})
      console.log("getBidInfo", res)
    }
  
    async recordAddr(number, addr) {
      await this.connect();
      const {addAddr} = Block.auction.methods;
      var isSucceess = await addAddr(number, addr).send({from:Block.account});
      console.log("record addr", isSucceess);
    }

    async vote(isWithdraw) {
      await this.connect();
      let number = this.state.number;
      let value = this.state.price;
      const {payForWithdraw} = Block.auction.methods;
      var res = await payForWithdraw(number, isWithdraw).send({from:Block.account, value:value})
      console.log("vote", res)
    }

    async getVote() {
      await this.connect();
      let t = Math.ceil(new Date().valueOf() / 1000);
      const {getProcess} = Block.auction.methods;
      let res = Number(await getProcess(t).call());
      this.setState({status:res})
      console.log("getVote process", t, res);
      if (res === 3) {
        const {getBidHighInfo} = Block.auction.methods;
        res = await getBidHighInfo().call({from:Block.account});
        this.setState({price: res[0], number:parseInt(res[1]), host:res[2], account:res[3]})
        console.log("getBidHighInfo res", res);
        if (res[1] !== '0') {
          let number = Number(res[1])
          const {getPayInfo} = Block.auction.methods;
          res = await getPayInfo(number).call({from:Block.account})
          console.log("getPayInfo", res);
          this.setState({isVote:res})
        } else {
            this.setState({isVote:3}) //没有竞拍
        }
      } else {
        this.setState({isVote:2}) //非申诉期
      }
    }


    async getAmount() {
      await this.connect();
      const {isGetMoney} = Block.auction.methods;
      var isReturn = await isGetMoney().call({from:Block.account});
      this.setState({isGetMoney:isReturn});
      const {queryAmount} = Block.auction.methods;
      let res = await queryAmount().call({from:Block.account});
      this.setState({amount:(res/10**18)});

    }


    async getBidAmount() {
      await this.connect()
      const {isGetMoney} = Block.auction.methods;
      var isReturn = await isGetMoney().call({from:Block.account});
      if (isReturn) {
        message.warning("您已经提取过收益");
        return ;
      }
      if (this.state.amount == 0) {
        message.info("您没有返利可以提取")
        return ;
      }
      const {getAmount} = Block.auction.methods;
      await getAmount().send({from:Block.account})
      message.info("提取完成！");
    }

    async queryAddrs(number) {
      await this.connect()
      const {getAddrs} = Block.auction.methods;
      let res = await getAddrs(number).call({from:Block.account});
      console.log("queryAddrs", res);
      this.setState({host:res[0], addr:res[1]})
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
      const success = await transfer(receiver, amount).call({ from: Block.account });
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
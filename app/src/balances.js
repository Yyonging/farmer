import React from 'react';
import Block from './block';
import BaseComponent from './baseComponet';
import { List, message, Avatar, Spin, Steps } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { Layout, Menu, Button, Card } from 'antd';
import {
  UserOutlined,
  PieChartOutlined,
  UploadOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import { Form, Input, Select } from 'antd';

const { Header, Sider} = Layout;
const { Step } = Steps;

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};


class Demo extends BaseComponent {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.onFinish = this.onFinish.bind(this);
    this.state = {
      balanceList:[],
      status:"",
      host:"",
      addr:"",
    }
  }

  onNumberChange = (value) => {
    this.queryAddrs(value);
  }

  onFinish = (values) => {
    this.transfer(values.address, values.number);
    this.refreshBalance();
  };

  componentDidMount() {
    this.refreshBalance();
  }

  render() {
    return (
      <div>
      <Form {...layout} name="control-ref" onFinish={this.onFinish} style={{margin:70}} ref={this.formRef}>
        <Form.Item
          name="address"
          label="区块链地址"
          rules={[
            {
              required: true,
            },
          ]} style={{width:"90%"}}
        >
          <Input placeholder={this.state.addr} disabled/>
        </Form.Item>
        <Form.Item
          name="addr"
          label="邮寄地址"
          rules={[
            {
              required: false,
            },
          ]} style={{width:"90%"}}
        >
          <Input placeholder={this.state.host} disabled/>
        </Form.Item>
        <Form.Item
          name="number"
          label="果树编号"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            placeholder="选择你拥有的果树编号"
            allowClear
            style={{width:"80%"}} onChange={this.onNumberChange}
          > 
            {this.state.balanceList.map(item => (<Option value={item} key={item}>果树编号: {item}</Option>))}
          </Select>
        </Form.Item>


      </Form>
      </div>
    );
  }
}


class MyCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      isGetMoney:false
    }
    this.refInput = React.createRef();
  }

  changeAddr = (e) => {
    this.refInput.current.value = e.target.value;
  }

  addAddr = () => {
    let addr = this.refInput.current.value;
    console.log("add addr", this.state.number, addr);
    this.recordAddr(this.state.number, addr)
  }

  getBidReturn = () => {
    this.getBidAmount();
  }
  componentDidMount() {
    this.getBidInfo();
    this.refreshProcess();
    this.getAmount();
  }

  render() {
    return (
      <Card title="我的竞拍">
        <Card type="inner" title="我的地址" >
          <strong>{this.state.account}</strong>
        </Card>
        <Card type="inner" title="我的出价" >
          <strong>{this.state.price / 10**18} ETH</strong>
        </Card>
          <Card
            style={{ marginTop: 16 }}
            type="inner"
            title="果树编号"
          >
            {this.state.number === '0'?"无":this.state.number}
          </Card>
            <Card
              style={{ marginTop: 16 }}
              type="inner"
              title="邮寄地址(地址确认期可填写)"
            >
              <input style={{marginRight:"10px"}} type="text"　placeholder={this.state.host}　ref={this.refInput} onChange={this.changeAddr.bind(this)}></input>
              <Button type="dashed" size="middle" onClick={this.addAddr.bind(this)}>确定</Button>

            </Card>
            <Card
              style={{ marginTop: 16 }}
                type="inner"
                title="收益(结算期可提取)"
            >
              <label>预估返利: {this.state.amount}</label>
              
              {!this.state.isGetMoney?
              <Button type="primary" size="middle" style={{marginLeft:"20px"}} onClick={this.getBidReturn.bind(this)}>提取返利</Button>
              : <Button type="primary" size="middle" style={{marginLeft:"20px"}} disabled>已提取返利</Button>
            }
            </Card>
    </Card>
    );
  }
}

class InfiniteListExample extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      tcs:[],
      hightests:[],
      addrs:[],
      data:[],
      status:4,
      loading: false,
      hasMore: true,
    };
    this.refInput = React.createRef();
  }
  
  componentDidMount() {
    this.refreshProcess()
    this.getTcs();
    this.getAddrs();
    this.getHighest();
    }

  bidTrc = (number) => {
    console.log("bidTrc", this.refInput.current.value);
    console.log("bidTrc", number);
    this.postBid(parseInt(number), parseFloat(this.refInput.current.value))
    this.getTcs();
  }

  changPrice = (e) => {
    console.log(e.target.value);
    this.refInput.current.value = e.target.value;
  }

  handleInfiniteOnLoad = () => {
    let { tcs } = this.state;
    this.setState({
      loading: true,
    });
    if (tcs.length > 15) {
      message.warning('已经到底了');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
  };

  render() {
    return (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={this.state.tcs}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="logo192.png" />
                  }
                  title={<a>{"果树编号："+item}</a>}
                />
                <div>
                  <p　className="ant-list-item-p"><strong>当前最高价</strong>: {this.state.hightests[index] / 10**18 + " ETH"}</p>
                  <p  className="ant-list-item-p"><strong>最高者地址</strong>: {this.state.addrs[index]}</p>
                  <input type="text" ref={this.refInput} className="ant-list-item-p" 
                    placeholder="出价(eth)" style={{width:"5em"}} defaultValue="0.1" onChange={this.changPrice.bind(this)} name="price"/>
                  {this.state.status === 0? <Button type="dashed" size="middle" onClick={this.bidTrc.bind(this, item)}>竞拍</Button>:
                    <Button type="dashed" size="middle" disabled>已结束</Button>
                  }
                  </div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && (
              <div className="demo-loading-container">
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

class MySteps extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      status:0, 
      processMap:["自由竞拍期", "地址确认期", "货物交割期", "确认申诉期", "结算期"]
    }
  }


  componentDidMount() {
    this.refreshProcess();
  }
  render() {
    return (
    <Steps current={parseInt(this.state.status)}>
      {this.state.processMap.map(item=><Step title={item} key={item}/>)}
    </Steps>)
  }
}

class WithdrawOrConfirm extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      status:1, 
      isVote:4, 
    }
  }
  componentDidMount() {
    this.getVote();
  }

  onClickItem　= (isWithdraw) => {
    console.log("WithdrawOrConfirm", this.state);
    if(this.state.status != 3) {
      message.warning("当前不是申诉期！");
    }
    else if(this.state.isVote === 3) {
      message.warning("您没有竞拍无法申诉或者确认收货");
    } else if(this.state.isVote === 4) {
      message.warning("系统暂时无法获取您的竞拍信息！");
    } else{
      this.vote(isWithdraw);
    }
  }
  render() {
    return (
      <div>
        <p　style={{width:"50%", marginLeft:"22%", marginTop:"10%"}}>确认申诉期,竞拍成功的您可以选择申诉或者确认收货,　如果选择申诉，并且大多数人也选择申诉时，farmer将得到无法获得你所竞拍果树所花费的奖励。
          选择确认收货，并且大多数人也选择确认收货时，farmer 能提取竞拍奖励，您也将获取竞拍花费的10%的返利。
        </p>
      <Button type="primary" htmlType="submit" style={{marginLeft:"30%", marginTop:"50px"}} onClick={this.onClickItem.bind(this, true)}>
      申诉投票
    </Button>
    <Button type="primary" htmlType="submit" style={{marginLeft:"10%"}} onClick={this.onClickItem.bind(this, false)} >
          确认收货
    </Button>
    </div>
    )
  }
}
class SiderDemo extends React.Component {
  state = {
    collapsed: false,
    current:{key:1}
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  onClickItem = (index) => {
    console.log("click item", index);
    this.setState({current:{key:index}});
  }

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo"><h1>果树Token化研究应用</h1>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />} onClick={this.onClickItem.bind(this, 1)}>
              我的竞拍
            </Menu.Item>
            <Menu.Item key="2" icon={<PieChartOutlined/>} onClick={this.onClickItem.bind(this, 2)}>
              果树列表
            </Menu.Item>
            <Menu.Item key="3" icon={<TeamOutlined />} onClick={this.onClickItem.bind(this, 3)}>
              地址查询
            </Menu.Item>
            <Menu.Item key="４" icon={<UploadOutlined />} onClick={this.onClickItem.bind(this, 4)}>
              申诉or确认
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <h1>果树Token化研究应用</h1>
            <MySteps/>
          </Header>
          {
            (this.state.current.key === 1) && <MyCard/> ||
            (this.state.current.key === 2 && <InfiniteListExample className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              height: "100%",
            }}></InfiniteListExample> ) || 
            (this.state.current.key === 3 && <Demo/>) ||
            (this.state.current.key === 4 && <WithdrawOrConfirm/>)
          }
        </Layout>
      </Layout>
    );
  }
}




















class ProcessStatus extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      status: "申诉期"
    }
    this.refreshProcess = this.refreshProcess.bind(this);
  }

  async refreshProcess() {
    await this.connect();
    const {getProcess} = Block.meta.methods;
    var res = await getProcess().call();
    const processMap = {"0":"自由认领交易期", "1":"申诉期", "2":"项目已结算"};
    console.log("ProcessStatus", processMap[res]);
    this.setState({status:processMap[res]});
  }

  componentDidMount() {
    this.refreshProcess();
    console.log('enter ProcessStatus componentWillMount ')
  }

  render() {
    return (
    <div>项目当前进度: <label>{this.state.status}</label></div>
    );
  }
}

class TreeList extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      balanceList: []
    }
    this.refreshStatus = this.refreshStatus.bind(this);
    console.log('enter constructor: ' + this.state.balanceList);
  }

  async refreshStatus() {
    await this.connect();
    const {getStatus} = Block.meta.methods;
    var balanceList = await getStatus().call();
    console.log('refreshStatus: '+ balanceList)
    var newBalanceList = balanceList.map(function(item, index) {return {key:index+1, value:item}});
    this.setState({balanceList:newBalanceList})
  }
  
  componentDidMount() {
      this.refreshStatus();
      console.log('enter TreeList componentWillMount ')
    }

    render() {
      return (
        <div className="shopping-list">
          <h3>果树列表</h3>
          <ul id="tree">
              {this.state.balanceList.map(item => (<li key={item.key}>果树编号: {item.key}</li>))}
          </ul>
        </div>
      );
    }
  }

  class ShowTree extends BaseComponent {
    constructor(props) {
      super(props);
      this.state = {
        balance: 0,
        balanceList: []
      }
      this.refreshBalance = this.refreshBalance.bind(this);
      console.log('enter constructor: ' + props);
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
        var balanceListShow = balanceList.filter(item => item!==0);
        this.setState({balanceList:balanceListShow});
      }
    }

    componentDidMount() {
      this.refreshBalance();
      console.log('enter ShowTree componentWillMount ')
    }

    render() {
      return (
        <div>        
          <div>我持有的果树共有：<label className="balance"> {this.state.balance}</label>棵</div>
          {this.state.balance !== 0 &&
          <div>我持有的果树编号为: <label><strong className="balanceList"> {this.state.balanceList.toString()}</strong></label></div> }
        </div>
        );
    }
  }

  class TransactTrc extends BaseComponent {
    constructor(props) {
      super(props);
      this.state = {
        balance: 0,
        balanceList: [],
        status:""
      }
      this.sendCoin = this.sendCoin.bind(this);
      this.refAddr = this.refAddr.bind(this);
      this.refNum = this.refNum.bind(this);
      console.log('enter constructor: ' + props);
    }

    refAddr(node) {
      this.addrInput = node;
    }

    refNum(node) {
      this.numInput = node;
    }

    async transfer(receiver, amount) {
      await this.connect();
      this.setState({status:"Initiating transaction... (please wait)"})
      const { transfer } = Block.meta.methods;
      const success = await transfer(receiver, amount).send({ from: Block.account });
      console.log(success);
      this.setState({status:"Transaction complete!"});
    }

    sendCoin() {
      const receiver = this.addrInput.value.trim();
      const amount = this.numInput.value.trim();
      console.log(receiver, amount);
      if (!receiver) {
        alert("请输入有效地址!");
        return;
      }
      if (!amount) {
        alert("请输入有效果树编码!");
        return;
      }
       this.transfer(receiver, amount);
    }

    render() {
      return (

        <div>
          向地址为:
          <input type="text" ref={this.refAddr} placeholder="e.g. 0x93e66d9baea28c17d9fc393b53e3fbdd76899dae"/> 的人转让编号为:
          <input type="text" ref={this.refNum} placeholder="e.g. 3" />
          的果树
          <button onClick={this.sendCoin}>确认</button>
          {this.state.status !== "" && <p>{this.state.status}</p>}
        </div>
        );
    }
  }
export  {TreeList, ProcessStatus, ShowTree, TransactTrc, SiderDemo};

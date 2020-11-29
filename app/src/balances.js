import React from 'react';
import Block from './block';

import { List, message, Avatar, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import { Layout, Menu, Button, Card } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  PieChartOutlined,
  UploadOutlined,
} from '@ant-design/icons';

import { Form, Input, Select } from 'antd';

const { Header, Sider, Content } = Layout;

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

class Demo extends React.Component {
  formRef = React.createRef();
  onGenderChange = (value) => {
    switch (value) {
      case 'male':
        this.formRef.current.setFieldsValue({
          note: 'Hi, man!',
        });
        return;

      case 'female':
        this.formRef.current.setFieldsValue({
          note: 'Hi, lady!',
        });
        return;

      case 'other':
        this.formRef.current.setFieldsValue({
          note: 'Hi there!',
        });
        return;
    }
  };
  onFinish = (values) => {
    console.log(values);
  };
  onReset = () => {
    this.formRef.current.resetFields();
  };
  onFill = () => {
    this.formRef.current.setFieldsValue({
      note: 'Hello world!',
      gender: 'male',
    });
  };

  render() {
    return (
      <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.onFinish}>
        <Form.Item
          name="address"
          label="区块链地址"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
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
            placeholder="Select a option and change input text above"
            onChange={this.onGenderChange}
            allowClear
          >
            <Option value="male">male</Option>
            <Option value="female">female</Option>
            <Option value="other">other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
        >
          {({ getFieldValue }) => {
            return getFieldValue('gender') === 'other' ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            转让
          </Button>
        </Form.Item>
      </Form>
    );
  }
}


class BaseComponent extends React.Component {

  async connect() {
    if (Block.meta == null) {
      await Block.start();
    }
  }

  async refreshProcess() {
    await this.connect();
    const {getProcess} = Block.meta.methods;
    var res = await getProcess().call();
    const processMap = {"0":"自由认领交易期", "1":"申诉期", "2":"项目已结算"};
    console.log(processMap[res]);
    this.setState({status:processMap[res]});
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
      var balanceListShow = balanceList.filter(item => item!==0);
      this.setState({balanceList:balanceListShow});
    }
  }

  async transfer(receiver, amount) {
    await this.connect();
    this.setState({status:"Initiating transaction... (please wait)"})
    const { transfer } = Block.meta.methods;
    const success = await transfer(receiver, amount).send({ from: Block.account });
    console.log(success);
    this.setState({status:"Transaction complete!"});
  }

}

class MyCard extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      balanceList: []
    }
    this.refreshBalance = this.refreshBalance.bind(this);
  }

  componentDidMount() {
    this.refreshBalance();
  }

  render() {
    return (
      <Card title="我的果树信息">
      <Card type="inner" title="果树数量" extra={<a href=""></a>}>
        <strong>{this.state.balance}</strong>
      </Card>
      {this.state.balance !== 0 &&
          <Card
            style={{ marginTop: 16 }}
            type="inner"
            title="果树编号"
            extra={<a href=""></a>}
          >
            {this.state.balanceList.toString()}
          </Card>
      }
    </Card>
    );
  }
}
class InfiniteListExample extends BaseComponent {
  state = {
    data: [{id:1, name:{last:'dyq'}, email:"123@123.com"}],
    balanceList:[],
    loading: false,
    hasMore: true,
  };

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
  }

  handleInfiniteOnLoad = () => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    if (data.length > 15) {
      message.warning('Infinite List loaded all');
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
            dataSource={this.state.balanceList}
            renderItem={item => (
              <List.Item key={item.key}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="logo192.png" />
                  }
                  title={<a href="">{"果树编号："+item.key}</a>}
                />
                <div>{
                    item.value === "1"? <Button type="dashed" size="middle">认领</Button>:
                    <Button type="dashed" size="middle" disabled>已认领</Button>
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

class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" ><h1 >基于区块链的果树扶贫应用</h1></div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              我的果树
            </Menu.Item>
            <Menu.Item key="2" icon={<PieChartOutlined/>}>
              果树列表
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              果树转让
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <h1 style={{width: "100%", textAlign:"center"}}>基于区块链的果树扶贫应用</h1>
          </Header>
          {/* <InfiniteListExample className="site-layout-background"
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              height: "100%",
            }}></InfiniteListExample> */}
          <MyCard/>
          {/* <Demo/> */}
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
    console.log('enter constructor: ' + props);
  }

  async refreshProcess() {
    await this.connect();
    const {getProcess} = Block.meta.methods;
    var res = await getProcess().call();
    const processMap = {"0":"自由认领交易期", "1":"申诉期", "2":"项目已结算"};
    console.log(processMap[res]);
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
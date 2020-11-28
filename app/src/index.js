import Web3 from "web3";
import metaCoinArtifact from "../../build/contracts/MetaCoin.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = metaCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        metaCoinArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refresh();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refresh: async function() {
    this.refreshProcess();
    this.refreshStatus();
    this.refreshBalance();
  },

  refreshProcess: async function() {
    const {getProcess} = this.meta.methods;
    var res = await getProcess().call();
    const processMap = {"0":"自由认领交易期", "1":"申诉期", "2":"项目已结算"};
    const processEle = document.getElementById("projectProcess");
    processEle.innerHTML = processMap[res];
    console.log(processMap[res]);
  },

  refreshStatus: async function() {
    const {getStatus} = this.meta.methods;
    var balanceList = await getStatus().call();
    console.log(balanceList)
    const trees = document.getElementById("tree");
    for (var i = 0; i < balanceList.length; i++) {
      trees.appendChild(this.addLi(i+1));
      trees.appendChild(this.addButton(balanceList[i], i+1, this));
    }

  },

  refreshBalance: async function() {
    const {balanceOf} = this.meta.methods;
    const balance = await balanceOf(this.account).call();
    const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;
    if (balance !== "0") {
      const { getBalance } = this.meta.methods;
      const balanceList = await getBalance(this.account).call();
      console.log(balanceList)
      var balanceListShow = balanceList.filter(item => item!=0);
      const balanceListElement = document.getElementsByClassName("balanceList")[0];
      balanceListElement.innerHTML = balanceListShow.toString();
    }
  },


  addLi: function(text) {
    var li = document.createElement("li");
    li.innerHTML="果树编号:" + text;
    return li
  },

  addButton: function(i, number, app) {
    var btn = document.createElement("button");
    if (i == 1) {
      btn.innerHTML="认领";
      btn.addEventListener("click", function(){app.buy(number)}, false);
    } else {
      btn.innerHTML="已认领";
      btn.setAttribute("disabled","disabled");
    }
    btn.setAttribute("id", number);
    return btn
  },

  buy: async function(number) {
    const {buyTrc} = this.meta.methods;
    var success = await buyTrc(number).call()
    console.log("认领：" + success)
    if (success) {
      var btn = document.getElementById(number);
      btn.innerHTML="已认领";
      btn.setAttribute("disabled","disabled");
      alert("成功认领");
    }
  },

  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;
    this.setStatus("Initiating transaction... (please wait)");
    const { transfer } = this.meta.methods;
    console.log(receiver, amount);
    const success = await transfer(receiver, amount).send({ from: this.account });
    console.log(success);
    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
      // new Web3.providers.HttpProvider("http://192.168.8.208:8545"),
    );
  }

  App.start();
});

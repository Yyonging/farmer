import metaCoinArtifact from "./MetaCoin.json";

const Block = {
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
          
          console.log("start: " + this.account);
        } catch (error) {
          console.error("Could not connect to contract or chain.");
        }
      },
};

export default Block;
import metaCoinArtifact from "./TreeCoin.json";
import auctionArtifact from "./Auction.json";

const Block = {
    web3: null,
    account: null,
    meta: null,
    auction: null,

    start: async function() {
        const { web3 } = this;
    
        try {
          // get contract instance
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = metaCoinArtifact.networks[networkId];
          const auctionArtifactNetWork = auctionArtifact.networks[networkId];
          this.meta = new web3.eth.Contract(
            metaCoinArtifact.abi,
            deployedNetwork.address,
          );
          this.auction = new web3.eth.Contract(
            auctionArtifact.abi,
            auctionArtifactNetWork.address,
          );
          // get accounts
          const accounts = await web3.eth.getAccounts();
          this.account = accounts[0];
          console.log("deploy network", auctionArtifactNetWork.address);
          
          console.log("start: ", this.account);
        } catch (error) {
          console.error("Could not connect to contract or chain.");
        }
      },
};

export default Block;
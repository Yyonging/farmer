const TreeCoin = artifacts.require("TreeCoin");
const Auction = artifacts.require("Auction");

module.exports = function(deployer) {
  deployer.deploy(TreeCoin).then(function() {
    return deployer.deploy(Auction, TreeCoin.address);
  });
};

const TreeCoin = artifacts.require("TreeCoin");
const Auction = artifacts.require("Auction");

module.exports = function(deployer) {
  deployer.deploy(TreeCoin);
  deployer.deploy(Auction, TreeCoin);
};

pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TreeCoin.sol";
import "../contracts/Auction.sol";

contract TestAuction {
    function testInitialBalanceUsingDeployedContract() public {
        Auction meta = Auction(DeployedAddresses.Auction());

        Assert.equal(
            uint(16),
            meta.getBidsAddr().length,
            "init bidAddr should be 16"
        );

        Assert.equal(
            uint(0),
            meta.getProcess(),
            "current process should be free"
        );
    }

    function testInitialBalanceWithNewMetaCoin() public {
        Auction meta = Auction(DeployedAddresses.Auction());

        Assert.equal(
            meta.getTreeCoins().length,
            uint(16),
            "Owner should have 10000 MetaCoin initially"
        );
    }
}

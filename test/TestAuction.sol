pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TreeCoin.sol";
import "../contracts/Auction.sol";

contract TestMetacoin {
    function testInitialBalanceUsingDeployedContract() public {
        Auction meta = Auction(DeployedAddresses.Auction());

        Assert.equal(
            uint(16),
            meta.getBidsAddr().length,
            "Owner should have 10000 MetaCoin initially"
        );
    }

    function testInitialBalanceWithNewMetaCoin() public {
        Auction meta = Auction(DeployedAddresses.Auction());

        uint expected = 0;

        Assert.equal(
            meta.getTreeCoins().length,
            uint(16),
            "Owner should have 10000 MetaCoin initially"
        );
    }
}

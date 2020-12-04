pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/TreeCoin.sol";

contract TestTreecoin {
    function testInitialBalanceUsingDeployedContract() public {
        TreeCoin meta = TreeCoin(DeployedAddresses.TreeCoin());

        Assert.equal(
            uint(16),
            meta.getTotal(),
            "Owner should have 10000 MetaCoin initially"
        );
    }

    function testInitialBalanceWithNewMetaCoin() public {
        TreeCoin meta = new TreeCoin();

        uint expected = 0;

        Assert.equal(
            uint(16),
            meta.getInitTrcNumbers().length,
            "Owner should have 10000 MetaCoin initially"
        );
    }
}

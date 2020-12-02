pragma solidity >=0.4.22 <0.7.0;

import "./TreeCoin.sol";

contract Auction {
    TreeCoin treeCoin;
    uint public auctionTime; //竞价开启时间
    struct Bid{
        uint256 highestPrice; //最高出价
        address addr; //最高出价地址
        bool isWithdraw;//是否退款
        bool isJudge; //是否已经申诉
        string host;
    }
    mapping(uint => Bid) bids; //出价情况
    uint256[] public treeNumbers;
    bool isFarmerGetMoney;

    constructor(address tc) public {
        treeCoin = TreeCoin(tc);
        //初始价格为树币的默认价格, 出价者为farmer
        for(uint256 i = 0; i < treeCoin.totalSupply; i++) {
            treeNumbers.push(treeCoin.initTrcs[i].number);
            bids[treeCoin.initTrcs[i].number] = new Bid(treeCoin.price, treeCoin.farmer, false, "");
        }
    }

    //定义项目进展阶段
    //自由竞拍期
    modifier free() {
        require(now <= auctionTime + 3600 * 24 * 7);
        _;
    }
    //货物地址确认期
    modifier addressConfirm() {
        require(now > auctionTime + 3600 * 24 * 7);
        require(now <= auctionTime + 3600 * 24 * 10);
        _;
    }
    //交割期
    modifier bidsConfirm() {
        require(now > auctionTime + 3600 * 24 * 10);
        require(now <= auctionTime + 3600 * 24 * 24);
        _;
    }
    //申诉期
    modifier withdrawConfirm() {
        require(now > auctionTime + 3600 * 24 * 24);
        require(now <= auctionTime + 3600 * 24 * 30);
        _;
    }
    //提款期
    modifier getMoney() {
        require(now > auctionTime + 3600 * 24 * 30);
        _;
    }

    //当前地址没有最高出价，允许再出价
    modifier allowBid() {
        bool isAllow = true;
        for (uint i=0; i < treeNumbers.length; i++) {
            if (msg.sender == bids[treeNumbers[i]].addr) {
                isAllow = false;
                continue;
            }
        }
        require(isAllow);
        _;

    }

    //查询目前所有最高出价
    function getBidsHighest() public view returns(uint[] memory highest){
        for (uint i=0; i < treeNumbers.length; i++) {
            highest[i] = bids[treeNumbers[i]].highestPrice;
        }
    }

    //查询目前所有最高出价者的地址
    function getBidsAddr() public view returns (uint[] memory highest){
        for (uint i=0; i < treeNumbers.length; i++) {
            highest[i] = bids[treeNumbers[i]].addr;
        }
    }

    //竞价某编号的树币
    function bid(uint number) public free allowBid payable returns (bool){
        require(msg.value > bids[number].highestPrice);
        bids[number].highestPrice = msg.value;
        bids[number].addr = msg.sender;
        return true;
    }

    //填写货物地址
    function addAddr(uint number, string memory host) public addressConfirm returns (bool){
        require(msg.sender == bids[number].addr);
        bids[number].host = host;
        return true;
    }

    //farmer 查询所有树币得主地址
    function getAddrs() public bidsConfirm returns (uint[] memory highest){
        require(msg.sender == treeCoin.farmer);
        for (uint i=0; i < treeNumbers.length; i++) {
            highest[i] = bids[treeNumbers[i]].host;
        }
    }
    
    //竞价者申诉期申诉 或者确认收货
    function payForWithdraw(uint number, bool isWithdraw) withdrawConfirm public payable returns(bool) {
        require(msg.value == bids[number][]);
        require(msg.sender == bids[number].addr);
        require(!bids[number].isJudge);
        bids[number].isWithdraw = isWithdraw;
        bids[number].isJudge = true;
        return true;
    }

    //farmer 提款 //只能提取所有钱的90%, 剩下10%作为返利，每增加一人申诉退款，少提取2/果树量(最高100%)
    function getFarmerAmount() getMoney public returns (bool) {
        //todo
        return true;
    }

    //竞价者获得返利或者退现
    function getWithdrawMoney(uint number) getMoney public returns (bool) {
        //竞价者确认成功获取返利 竞价者申诉失败无法退现
        require(msg.sender == bids[number].addr);
        bool isWithdraw = _isWithdraw();
        //todo
        return true;

    }

    //是否应该退款
    function _isWithdraw() getMoney private returns (bool) {
        uint unWithdrawCount = 0;
        uint withdrawCount = 0;
        for (uint i=0; i < treeNumbers.length; i++) {
            if (bids[treeNumbers[i]].isJudge && bids[treeNumbers[i].isWithdraw]) {
                withdrawCount ++;
            }
            if (bids[treeNumbers[i]].isJudge && !bids[treeNumbers[i].isWithdraw]) {
                unWithdrawCount ++;
            }
        }
        return withdrawCount > unWithdrawCount;
    }

    //获取所有树币的编号
    function getTreeCoins() public view returns (uint[] memory) {
        return treeNumbers; 
    }
}

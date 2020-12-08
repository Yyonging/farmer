pragma solidity >=0.4.22 <0.7.0;
// pragma experimental ABIEncoderV2;
import "./TreeCoin.sol";

contract Auction {
    TreeCoin treeCoin;
    uint public auctionTime; //竞价开启时间
    uint constant total = 16;
    bool isFarmerGetMoney;
    struct Bid {
        uint256 highestPrice; //最高出价
        address payable addr; //最高出价地址
        bool isWithdraw;//是否退款
        bool isJudge; //是否已经申诉
        string host;
    }
    
    address farmer;
	enum Process { free, addrConfirm, bidsConfirm, withdrawConfirm, end }
    uint32[] public treeNumbers;
    mapping(uint => Bid) bids; //出价情况
    
    event ProcessEvent(uint256 _value);
    event LogString(string _value);
    event BidEvent(uint256 _value, address _addr);

    constructor(address tc) public {
        treeCoin = TreeCoin(tc);
        farmer = msg.sender;
        uint256 price = treeCoin.getPrice();
        treeNumbers = treeCoin.getInitTrcNumbers();
        auctionTime = now;
        //初始价格为树币的默认价格, 出价者为farmer
        for(uint i = 0; i < treeNumbers.length; i++) {
            // treeNumbers.push(treeCoin.initTrcs[i].number);
            bids[treeNumbers[i]] = Bid(price, msg.sender, false, false, "");
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
        // require(now > auctionTime + 3600 * 24 * 7);
        // require(now <= auctionTime + 3600 * 24 * 10);
        _;
    }
    //货物交割期
    modifier bidsConfirm() {
        require(now > auctionTime + 3600 * 24 * 10);
        require(now <= auctionTime + 3600 * 24 * 24);
        _;
    }
    //确认申诉期
    modifier withdrawConfirm() {
        require(now > auctionTime + 3600 * 24 * 24);
        require(now <= auctionTime + 3600 * 24 * 30);
        _;
    }
    //提款结算期
    modifier getMoney() {
        require(now > auctionTime + 3600 * 24 * 30);
        _;
    }

    //当前地址没有最高出价，允许再出价
    modifier allowBid() {
        bool isAllow = true;
        for (uint i=0; i < total; i++) {
            if (msg.sender == bids[treeNumbers[i]].addr) {
                isAllow = false;
                continue;
            }
        }
        require(isAllow);
        _;

    }

    //查询当前项目阶段
    function getProcess() public returns (Process){
        if (now <= auctionTime + 3600 * 24 * 7) return Process.free;
        else if (now > auctionTime + 3600 * 24 * 7 && now <= auctionTime + 3600 * 24 * 10) return Process.addrConfirm;
        else if (now > auctionTime + 3600 * 24 * 10 && now <= auctionTime + 3600 * 24 * 24) return Process.bidsConfirm;
        else if (now > auctionTime + 3600 * 24 * 24 && now <= auctionTime + 3600 * 24 * 30) return Process.withdrawConfirm;
        return Process.end;
    }

    //查询目前所有最高出价
    function getBidsHighest() public view returns(uint256[total] memory highest){
        for (uint i=0; i < treeNumbers.length; i++) {
            highest[i] = bids[treeNumbers[i]].highestPrice;
        }
    }

    //查询目前所有最高出价者的地址
    function getBidsAddr() public view returns (address[total] memory a){
        for (uint i=0; i < total; i++) {
            a[i] = bids[treeNumbers[i]].addr;
        }
    }

    //查询当前账户的出价信息
    function getBidHighInfo() public view returns(uint256, uint32, string memory, address) {
        for (uint i=0; i < total; i++) {
            if (msg.sender == bids[treeNumbers[i]].addr) {
                return (bids[treeNumbers[i]].highestPrice, treeNumbers[i], bids[treeNumbers[i]].host, msg.sender);
            }
        }
        return (0,0,"", msg.sender);
    }

    //竞价某编号的树币
    function bid(uint number) public free allowBid payable returns (bool){
        require(msg.value > bids[number].highestPrice);
        //退款
        if (bids[number].addr != farmer) {
            bids[number].addr.transfer(bids[number].highestPrice);
        }
        bids[number].highestPrice = msg.value;
        bids[number].addr = msg.sender;
        return true;
    }

    //填写货物地址
    function addAddr(uint number, string memory host) public addressConfirm returns (bool){
        // require(msg.sender == bids[number].addr);
        emit LogString(host);
        bids[number].host = host;
        return true;
    }

    //farmer 查询所有树币得主地址
    // function getAddrs() public bidsConfirm returns (string[] memory highest){
    //     require(msg.sender == farmer);
    //     for (uint i=0; i < treeNumbers.length; i++) {
    //         highest[i] = bids[treeNumbers[i]].host;
    //     }
    // }
    
    //竞价者申诉期申诉 或者确认收货
    function payForWithdraw(uint number, bool isWithdraw) withdrawConfirm public payable returns(bool) {
        require(msg.value == bids[number].highestPrice);
        require(msg.sender == bids[number].addr);
        require(!bids[number].isJudge);
        bids[number].isWithdraw = isWithdraw;
        bids[number].isJudge = true;
        return true;
    }

    function getAmount() getMoney public returns (bool) {
        //farmer 提款前提 不退款反馈多于退款反馈 只能提取未申诉退款钱的90%, 剩下10%作为未申诉退款返利
        //judge 成功 获取10%返利 未judge 不能获取返利
        //每增加一人申诉退款，不仅不能提取该树币的钱，且减少提取等量的钱
        uint256 amount;
        uint256 decreaseAmount;
        if (!_isWithdraw() && (msg.sender == farmer)) {
            for (uint i=0; i < treeNumbers.length; i++) {
                if (!bids[treeNumbers[i]].isJudge || !bids[treeNumbers[i]].isWithdraw) {
                    amount += bids[treeNumbers[i]].highestPrice * 9 / 10;
                } else {
                    decreaseAmount += bids[treeNumbers[i]].highestPrice;
                    }
            }
            if (amount > decreaseAmount) {
                msg.sender.transfer(amount - decreaseAmount);
            }
        } else if (!_isWithdraw() && (msg.sender != farmer)) {
            for (uint i=0; i < treeNumbers.length; i++) {
                if(msg.sender == bids[treeNumbers[i]].addr) {
                    if (bids[treeNumbers[i]].isJudge && !bids[treeNumbers[i]].isWithdraw) {
                        msg.sender.transfer(bids[treeNumbers[i]].highestPrice*11 / 10);
                        return true;
                    }
                }
            }
        } else if (_isWithdraw() && (msg.sender != farmer)) {
            for (uint i=0; i < treeNumbers.length; i++) {
                if(msg.sender == bids[treeNumbers[i]].addr) {
                    if (bids[treeNumbers[i]].isJudge && bids[treeNumbers[i]].isWithdraw) {
                        msg.sender.transfer(bids[treeNumbers[i]].highestPrice*2);
                        return true;
                    }
                }
            }
        }
                
        return true;
    }

    //是否应该退款
    function _isWithdraw() getMoney private view returns (bool) {
        uint unWithdrawCount = 0;
        uint withdrawCount = 0;
        for (uint i=0; i < treeNumbers.length; i++) {
            if (bids[treeNumbers[i]].isJudge && bids[treeNumbers[i]].isWithdraw) {
                withdrawCount ++;
            }
            if (bids[treeNumbers[i]].isJudge && !bids[treeNumbers[i]].isWithdraw) {
                unWithdrawCount ++;
            }
        }
        return withdrawCount > unWithdrawCount;
    }

    //获取所有树币的编号
    function getTreeCoins() public view returns (uint32[] memory) {
        return treeNumbers; 
    }
}

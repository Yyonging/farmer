pragma solidity >=0.4.22 <0.7.0;

import "./ConvertLib.sol";

contract MetaCoin {
	string public name = "TreeCoin"; //树币
	string public symbol = "TRC";
	uint constant totalSupply = 16;
	uint256 price = 20; //认领价格
	address farmer;
	struct Trc {
		uint number; //果树编号
	}
	Trc[] initTrcs;
	mapping (address => Trc[]) balances;
	mapping (address => mapping (address => Trc[])) public allowed;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	event Approval(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		for(uint i = 0; i < totalSupply; i++) {
			initTrcs.push(Trc(i));
		}
		farmer = tx.origin;
		balances[farmer] = initTrcs;
	}

	//余额
	function balanceOf(address _owner) public view returns (uint256 balance){
		return balances[_owner].length;
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(_to != address(0x0));
        require(_value >= 0);
        require(_value < 16);
		for (uint i = 0; i < balances[msg.sender].length; i ++) {
			if ((balances[msg.sender][i].number == _value) && (!checkOwn(_to, _value))) {
				delete (balances[msg.sender][i]);
				balances[_to].push(initTrcs[_value]);
				emit Transfer(msg.sender, _to, _value);
				return true;
			}
		}
		return false;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        Trc[] memory allowance = allowed[_from][msg.sender];
		bool flag = false;
		for (uint i = 0; i < balances[_from].length; i++) {
			if (balances[_from][i].number == _value){
				flag = true;
				continue;
			}
		}
		if (!flag){
			return false; //无此树币
		}
		for (uint i = 0; i < allowance.length; i++) {
			if ((allowance[i].number == _value) && (!checkOwn(_to, _value))) {
				delete (balances[msg.sender][i]);
				balances[_to].push(initTrcs[_value]);
		        emit Transfer(_from, _to, _value);
		        return true;
			}
		}
		require(false);
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
		require(_value < totalSupply);
		require(_value >= 0);
        Trc[] memory allowance = allowed[msg.sender][_spender];
		for (uint i = 0; i < allowance.length; i++) {
			if (allowance[i].number == _value) {
				return true;
			}
		}
        allowed[msg.sender][_spender].push(initTrcs[_value]);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

	function checkOwn(address addr, uint number) public view returns(bool) {
		for (uint i = 0; i < balances[addr].length; i++){
			if (balances[addr][i].number == number) {
				return true;
			}
		}
		return false;
	}

	function getBalanceInEth(address addr) public view returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}

	function getBalance(address addr) public view returns(uint) {
		return balances[addr].length;
	}
}

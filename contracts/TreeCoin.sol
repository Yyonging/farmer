pragma solidity >=0.4.22 <0.7.0;

contract TreeCoin {
	string public name = "TreeCoin"; //树币
	string public symbol = "TRC";
	uint constant public totalSupply = 16;
	uint256 price = 10**17; //最低价格
	address public farmer;
	struct Trc {
		uint number; //果树编号 可以扩展更多的描述信息
	}
	Trc[] public initTrcs;
	enum Process { free, Appeal, end }
	Process process;
	mapping (address => Trc[]) balances;
	mapping (address => mapping (address => Trc[])) public allowed;

	event Transfer(address indexed _from, address indexed _to, uint256 _value);
	event Approval(address indexed _from, address indexed _to, uint256 _value);

	constructor() public {
		// for(uint i = 1; i <= totalSupply; i++) {
		// 	initTrcs.push(Trc(i));
		// }
		//允许自定义编号
		initTrcs = [Trc(6), Trc(66), Trc(666), Trc(6666),
			Trc(66666), Trc(666666), Trc(6666666), Trc(66666666),
			Trc(8), Trc(88), Trc(888), Trc(8888),
			Trc(88888), Trc(888888), Trc(8888888), Trc(88888888)];
		farmer = tx.origin;
		balances[farmer] = initTrcs;
	}

	//余额
	function balanceOf(address _owner) public view returns (uint256 balance){
		return balances[_owner].length;
	}

	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(_to != address(0x0));
        require(_value > 0);
        require(_value <= 16);
		if (_deleteOne(msg.sender, _value)) {
			balances[_to].push(initTrcs[_value-1]);
			emit Transfer(msg.sender, _to, _value);
			success = true; 
		}
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
				if (_deleteOne(_from, _value)) {
					balances[_to].push(initTrcs[_value-1]);
					emit Transfer(_from, _to, _value);
					return true;
				}
			}
		}
		return false;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
		require(_value < totalSupply);
		require(_value >= 0);
		require(_spender != address(0));
        Trc[] memory allowance = allowed[msg.sender][_spender];
		for (uint i = 0; i < allowance.length; i++) {
			if (allowance[i].number == _value) {
				return true;
			}
		}
        allowed[msg.sender][_spender].push(initTrcs[_value-1]);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

	function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
		return allowed[_owner][_spender].length;
	}

	function checkOwn(address addr, uint number) public view returns(bool) {
		for (uint i = 0; i < balances[addr].length; i++){
			if (balances[addr][i].number == number) {
				return true;
			}
		}
		return false;
	}

	//删除持有的树币
	function _deleteOne(address addr, uint number) private returns(bool success){
		uint length = balances[addr].length;
		for (uint i = 0; i < length - 1; i++) {
			if (balances[addr][i].number == number) {
				if (i == length - 1) {
					delete balances[addr][i];
				} else {
					balances[addr][i] = balances[addr][length-1];
					delete balances[addr][length-1];
				}
				balances[addr].length -= 1;
				success = true;
			}
		}
	}

	//认领果树
	function buyTrc(uint number) public payable returns (bool success) {
        require(number > 0);
        require(number <= totalSupply);
		require(msg.sender != farmer);
		require(msg.value == price);
		if(_deleteOne(farmer, number)) {
			balances[msg.sender].push(initTrcs[number-1]);
			emit Transfer(farmer, msg.sender, number);
			success = true;
		}
		require(success);
	}

	//查看持有的树币列表
	function getBalance(address addr) public view returns(uint[totalSupply] memory bs) {
		for (uint i = 0; i < balances[addr].length; i++) {
			bs[i] = balances[addr][i].number;
		}
	}

	//查看项目进展
	function getProcess() public view returns(Process) {
		return Process.free;
	}
	
	//查看所有果树状态
	function getStatus() public view returns(uint[totalSupply] memory bs){
		for (uint i = 0; i < balances[farmer].length; i++) {
			bs[balances[farmer][i].number-1] = 1;
		}
	}

}

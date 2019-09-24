pragma solidity ^0.5.0;

contract Fin4DemoFaucet {

    address public owner;
    address[] public donors;
    mapping (address => uint256) public donorAmounts;
    uint256 public drip = 0.01 * 1000000000000000000;
    mapping (address => bool) public blacklisted;

    constructor() public {
        owner = msg.sender;
    }

    // to pay Ether into this contract, the gas limit might have to be raised significantly (e.g. > 100000)
    function () external payable {
        // msg.value is in wei: 1 ETH is 1 000 000 000 000 000 000 wei
        donorAmounts[msg.sender] += msg.value;
        donors.push(msg.sender);
    }

    function balance() public view returns(uint256) {
        return address(this).balance;
    }

    function myDonation() public view returns(uint256) {
        return donationOf(msg.sender);
    }

    function donationOf(address addr) public view returns(uint256) {
        return donorAmounts[addr];
    }

    function blacklist(address addr) public {
        require(msg.sender == owner, "Only the faucet owner can modify the blacklist");
        blacklisted[addr] = true;
    }

    function revokeBlacklisting(address addr) public {
        require(msg.sender == owner, "Only the faucet owner can modify the blacklist");
        blacklisted[addr] = false;
    }

    function setDrip(uint256 value) public {
        require(msg.sender == owner, "Only the faucet owner can change the drip value");
        drip = value;
    }

    function requestDrip() public {
        require(!blacklisted[msg.sender], "Address is blacklisted");
        msg.sender.transfer(drip);
    }
}

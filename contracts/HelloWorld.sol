pragma solidity ^0.5.0;

// via https://medium.com/coinmonks/5-minute-guide-to-deploying-smart-contracts-with-truffle-and-ropsten-b3e30d5ee1e
contract HelloWorld {
    function sayHello() public pure returns(string memory){
        return("hello world");
    }
}

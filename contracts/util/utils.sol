pragma solidity ^0.5.17;

contract utils {

    // from https://ethereum.stackexchange.com/a/40977
    function uint2str(uint numb) internal pure returns (string memory) {
        uint _i = numb;
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }

    // from https://ethereum.stackexchange.com/a/72679/56047, plus using 42 from the comment below
    function addressToString(address _addr) public pure returns(string memory) {
        bytes32 value = bytes32(uint256(_addr));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }

    function arrayContainsAddress(address[] memory arr, address addrToCheck) public pure returns(bool) {
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] == addrToCheck) {
                return true;
            }
        }
        return false;
    }

/*function _countNonZeroBytes(bytes32 value) private returns(uint8) {
        // via https://ethereum.stackexchange.com/a/80456/56047
        uint8 i = 0;
        while(i < 32 && value[i] != 0) {
            i++;
        }
        return i;
    }*/
}

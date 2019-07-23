pragma solidity ^0.5.8;

import "./PLCR/PLCRFactory.sol";
import "./PLCR/PLCRVoting.sol";
import "./Parameterizer.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Capped.sol";


contract ParameterizerFactory {

    event NewParameterizer(address creator, address token, address plcr, Parameterizer parameterizer);

    PLCRFactory public plcrFactory;
    ProxyFactory public proxyFactory;
    Parameterizer public canonizedParameterizer;

    /// @dev constructor deploys a new canonical Parameterizer contract and a proxyFactory.
    constructor(PLCRFactory _plcrFactory) public {
        plcrFactory = _plcrFactory;
        proxyFactory = plcrFactory.proxyFactory();
        canonizedParameterizer = new Parameterizer();
    }

    /*
    @dev deploys and initializes a new Parameterizer contract that consumes a token at an address
    supplied by the user.
    @param _token             an ERC20 token to be consumed by the new Parameterizer contract
    @param _plcr              a PLCR voting contract to be consumed by the new Parameterizer contract
    @param _parameters        array of canonical parameters
    */
    function newParameterizerBYOToken(
        ERC20 _token,
        uint[] memory _parameters
    ) public returns (Parameterizer) {
        PLCRVoting plcr = plcrFactory.newPLCRBYOToken(_token);
        Parameterizer parameterizer = Parameterizer(proxyFactory.createProxy(address(canonizedParameterizer), ""));

        parameterizer.init(
            address(_token),
            address(plcr),
            _parameters
        );
        emit NewParameterizer(msg.sender, address(_token), address(plcr), parameterizer);
        return parameterizer;
    }

    /*
    @dev deploys and initializes new ERC20, PLCRVoting, and Parameterizer contracts
    @param _supply            the total number of tokens to mint in the ERC20 contract
    @param _name              the name of the new ERC20 token
    @param _decimals          the decimal precision to be used in rendering balances in the ERC20 token
    @param _symbol            the symbol of the new ERC20 token
    @param _parameters        array of canonical parameters
    */
    function newParameterizerWithToken(
        uint _supply,
        string memory _name,
        uint8 _decimals,
        string memory _symbol,
        uint[] memory _parameters
    ) public returns (Parameterizer) {
        // Creates a new ERC20 token & transfers the supply to creator (msg.sender)
        // Deploys & initializes a new PLCRVoting contract
        PLCRVoting plcr = plcrFactory.newPLCRWithToken(_supply);
        ERC20 token = ERC20(plcr.token());
        token.transfer(msg.sender, _supply);

        // Create & initialize a new Parameterizer contract
        Parameterizer parameterizer = Parameterizer(proxyFactory.createProxy(address(canonizedParameterizer), ""));
        parameterizer.init(
            address(token),
            address(plcr),
            _parameters
        );

        emit NewParameterizer(msg.sender, address(token), address(plcr), parameterizer);
        return parameterizer;
    }
}


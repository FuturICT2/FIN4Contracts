pragma solidity ^0.5.8;

import "../tokens/GOV.sol";
import "./ParameterizerFactory.sol";
import "./Registry.sol";
import "./PLCR/PLCRVoting.sol";
import "./Parameterizer.sol";

contract RegistryFactory {

    event NewRegistry(address creator, GOV token, PLCRVoting plcr, Parameterizer parameterizer, Registry registry);

    ParameterizerFactory public parameterizerFactory;
    ProxyFactory public proxyFactory;
    Registry public canonizedRegistry;

    /// @dev constructor deploys a new proxyFactory.
    constructor(ParameterizerFactory _parameterizerFactory) public {
        parameterizerFactory = _parameterizerFactory;
        proxyFactory = parameterizerFactory.proxyFactory();
        canonizedRegistry = new Registry();
    }

    /*
    @dev deploys and initializes a new Registry contract that consumes a token at an address
        supplied by the user.
    @param _token           an GOV token to be consumed by the new Registry contract
    */
    function newRegistryBYOToken(
        GOV _token,
        uint[] memory _parameters,
        string memory _name
    ) public returns (Registry) {
        Parameterizer parameterizer = parameterizerFactory.newParameterizerBYOToken(_token, _parameters);
        PLCRVoting plcr = parameterizer.voting();

        Registry registry = Registry(proxyFactory.createProxy(address(canonizedRegistry), ""));
        registry.init(address(_token), address(plcr), address(parameterizer), _name);

        emit NewRegistry(msg.sender, _token, plcr, parameterizer, registry);
        return registry;
    }

    /*
    @dev deploys and initializes a new Registry contract, an GOV, a PLCRVoting, and Parameterizer
        to be consumed by the Registry's initializer.
    @param _supply          the total number of tokens to mint in the GOV contract
    @param _name            the name of the new GOV token
    @param _decimals        the decimal precision to be used in rendering balances in the GOV token
    @param _symbol          the symbol of the new GOV token
    */
    function newRegistryWithToken(
        uint _supply,
        string memory _tokenName,
        uint8 _decimals,
        string memory _symbol,
        uint[] memory _parameters,
        string memory _registryName
    ) public returns (Registry) {
        // Creates a new GOV token & transfers the supply to creator (msg.sender)
        // Deploys & initializes (1) PLCRVoting contract & (2) Parameterizer contract
        Parameterizer parameterizer = parameterizerFactory.newParameterizerWithToken(_supply, _tokenName, _decimals, _symbol, _parameters);
        GOV token = GOV(parameterizer.token());
        token.transfer(msg.sender, _supply);
        PLCRVoting plcr = parameterizer.voting();

        // Create & initialize a new Registry contract
        Registry registry = Registry(proxyFactory.createProxy(address(canonizedRegistry), ""));
        registry.init(address(token), address(plcr), address(parameterizer), _registryName);

        emit NewRegistry(msg.sender, token, plcr, parameterizer, registry);
        return registry;
    }
}


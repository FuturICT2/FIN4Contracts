pragma solidity ^0.5.17;

import 'contracts/stub/Fin4TokenStub.sol';
import 'contracts/underlyings/BaseSourcerer.sol';
import 'contracts/underlyings/SuccessfulClaimNotifierInterface.sol';

contract Fin4Underlyings {

    mapping (bytes32 => Underlying) public underlyings; // 2nd mapping with contractAddress as key?
    bytes32[] public names;
    mapping(address => bytes32[]) public tokenToRegisteredUnderlyings;

    struct Underlying {
        bool exists;
        bytes32 name;
        bool isSourcerer;
        address contractAddress; // can be external to Fin4, must implement SuccessfulClaimNotiferInterface
        bytes32 attachment;
        bool usableForAll; // if false, it will not shown under "add existing" in the frontend
        // TODO: valid for / editable later on / what else?
        // TODO a visibility boolean to optionally hide it in frontend?
    }

    uint public countUsableForAll = 0;

    function addUnderlying(bytes32 name, address contractAddress, bool isSourcerer, bytes32 attachment, bool usableForAll) public {
        require(!underlyings[name].exists, "Underyling with that name already exists");
        Underlying storage underlying = underlyings[name];
        underlying.exists = true;
        underlying.name = name;
        underlying.isSourcerer = isSourcerer;
        underlying.contractAddress = contractAddress;
        underlying.attachment = attachment;
        underlying.usableForAll = usableForAll;
        if (usableForAll) {
            countUsableForAll ++;
        }
        names.push(name);
    }

    function addUnderlyings(bytes32[] memory _names, address[] memory contractAddresses, bytes32[] memory attachments,
        bool[] memory usableForAlls) public {
        for (uint i = 0; i < _names.length; i ++) {
            if (!underlyings[_names[i]].exists) { // or use require here?
                addUnderlying(_names[i], contractAddresses[i], false, attachments[i], usableForAlls[i]);
            }
        }
    }

    function addSourcerer(bytes32 name, address contractAddress) public {
        addUnderlying(name, contractAddress, true, "", true);
    }

    function getUnderlyings() public view returns(bytes32[] memory, bool[] memory, address[] memory, bytes32[] memory) {
        bool[] memory isSourcerers = new bool[](countUsableForAll);
        address[] memory contractAddresses = new address[](countUsableForAll);
        bytes32[] memory attachments = new bytes32[](countUsableForAll);
        for (uint i = 0; i < countUsableForAll; i ++) {
            Underlying memory underlying = underlyings[names[i]];
            if (!underlying.usableForAll) {
                continue;
            }
            isSourcerers[i] = underlying.isSourcerer;
            contractAddresses[i] = underlying.contractAddress;
            attachments[i] = underlying.attachment;
        }
        return (names, isSourcerers, contractAddresses, attachments);
    }

    function getSourcererParams(address sourcererAddress) public view returns(string memory) {
        return BaseSourcerer(sourcererAddress).getParameterForTokenCreatorToSetEncoded();
    }

    function getSourcererPairs(address sourcererAddress) public view returns(address[] memory,
        address[] memory, address[] memory, uint[] memory, uint[] memory, uint[] memory) {
        return BaseSourcerer(sourcererAddress).getPairs();
    }

    function registerUnderlyingsWithToken(address tokenAddress, bytes32[] memory _names) public {
        if (_names.length > 0) {
            tokenToRegisteredUnderlyings[tokenAddress] = _names;
        }
        // TODO shield against underylings being added multiple times to a token

        // calling it here instead of a separate call from Fin4TokenCreator because of out of gas during deployment
        setTokenFinishedConstructing(tokenAddress);
    }

    function getUnderlyingsRegisteredOnToken(address tokenAddress) public returns(bytes32[] memory) {
        return tokenToRegisteredUnderlyings[tokenAddress];
    }

    function callSuccessfulClaimNotifiers(address tokenAddress, address claimer, uint quantity) public {
        // TODO require Fin4Claiming must be msg.sender, plus other safeguards?
        for (uint i = 0; i < tokenToRegisteredUnderlyings[tokenAddress].length; i ++) {
            Underlying memory underlying = underlyings[tokenToRegisteredUnderlyings[tokenAddress][i]];
            if (underlying.isSourcerer || underlying.contractAddress == address(0)) {
                continue;
            }
            SuccessfulClaimNotifierInterface(underlying.contractAddress).successfulClaimNotify(tokenAddress, claimer, quantity);
        }
    }

    // SOURCERER SETTINGS

    struct SourcererSettings {
        bool exists;
        // for use as PAT
        bool tokenIsConstructing; // only true while token creation process in the frontend is not finished
        bool allowAddPairsAfterCreation;
        // for use as Collateral
        // TODO
    }

    mapping(address => SourcererSettings) public tokenToSourcererSettings;

    // renamed from storeSourcererSettingsForToken() to be able to reuse TokenCreationProcess.setParamsOnOtherContract() in the frontend
    function setParameters(address token, bool allowAddPairsAfterCreation) public {
        require(!tokenToSourcererSettings[token].exists, "Sourcerer settings for this token are already stored");
        // TODO require msg.sender == token creator
        SourcererSettings storage settings = tokenToSourcererSettings[token];
        settings.exists = true;
        settings.tokenIsConstructing = true;
        settings.allowAddPairsAfterCreation = allowAddPairsAfterCreation;
        // TODO add more
    }

    function setTokenFinishedConstructing(address token) private {
        if (tokenToSourcererSettings[token].exists) {
            // the if as safeguard if someone somehow skipped that step in the frontend
            tokenToSourcererSettings[token].tokenIsConstructing = false;
        }
    }

    function newSourcererPairAllowedWithPat(address user, address pat) public returns(bool) {
        if (!tokenToSourcererSettings[pat].exists) {
            return false; // by default not
        }
        if (user != Fin4TokenStub(pat).getTokenCreator()) {
            return false;
        }
        if (tokenToSourcererSettings[pat].tokenIsConstructing) {
            return true;
        }
        return tokenToSourcererSettings[pat].allowAddPairsAfterCreation;
    }

    function newSourcererPairAllowedWithCollateral(address user, address pat, address collateral) public returns(bool) {
        if (!tokenToSourcererSettings[collateral].exists) {
            return true;
        }
        // TODO more options, see outcommented checkboxes in Step4Minting.jsx
        return true;
    }
}

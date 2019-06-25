pragma solidity ^0.5.0;

import "contracts/Fin4BaseProofType.sol";

contract ProofDummy is Fin4BaseProofType {

  constructor()
    Fin4BaseProofType("Proof Dummy", "For dev")
    public {}

}

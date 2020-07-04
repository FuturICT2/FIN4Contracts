/* Verifiers file contains meta data and contract address of all used verifiers
 * Data is used for searching possible verifiers in token creation process
 */

const verifierOptions = {
  chain: {
    values: ["On-Chain", "Off-Chain"],
    description:
      "Determines whether the verification is done on or off chain",
  },
  type: {
    // Interactive: Requires Claimer to do something
    // Non-Interactive: Does not require Claimer to do anything
    // Social: Requires other users to do something
    values: ["Non-Interactive", "Interactive", "Social"],
    description:
      "Determines whether the input is verified by other users, the system or both.",
  },
  claimerInput: {
    inputType: [
      "System/Sensor generated data",
      "User generated data",
      "Both",
      "None",
    ],
    sensorData: {
      values: ["None", "Location", "Time", "Gyroscope"],
      description:
        "Determines if and which sensor data must be provided by the claimer.",
    },
    userData: {
      values: ["None", "Picture", "Video", "Password", "Address", "File", "GroupID"],
      description:
        "Determines if and which content must be provided by the claimer.",
    },
  },
};

const verifiers = {
  Password: {
    chain: "On-Chain",
    type: "Interactive",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "Password",
    },
    description:
      "Approval if the user provides the password matching the one the token creator set.",
    address: "",
  },
  Picture: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "Picture",
    },
    description:
      "The claimer has to supply a picture, based on which the approver will decide to approve.",
    address: "",
  },
  Blacklisting: {
    chain: "On-Chain",
    type: "Non-Interactive",
    claimerInput: {
      inputType: "System/Sensor generated data",
      sensorData: "Address",
      userData: "None",
    },
    description:
      "The token creator defines group(s) and/or individual accounts that can not claim a token.",
    address: "",
  },
  Whitelisting: {
    chain: "On-Chain",
    type: "Non-Interactive",
    claimerInput: {
      inputType: "System/Sensor generated data",
      sensorData: "Address",
      userData: "None",
    },
    description:
      "The token creator defines group(s) and/or individual accounts that can claim a token while everyone else can not",
    address: "",
  },
  Location: {
    chain: "On-Chain",
    type: "Interactive",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "Location",
    },
    description:
      "A location, which is within a radius of a location the token creator defines, needs to be provided.",
    address: "",
  },
  SelfApprove: {
    chain: "On-Chain",
    type: "Interactive",
    claimerInput: {
      inputType: "None",
      sensorData: "None",
      userData: "None",
    },
    description: "Claimers approve their own claim.",
    address: "",
  },
  SelfieTogether: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "Picture",
    },
    description:
      "The claimer supplies a picture, based on which a self-chosen approver and a member of a group of users appointed by the token creator decide to approve.",
    address: "",
  },
  // verifiers that are commented out are not deployed in 2_deploy_contracts.js yet
  //SensorOneTimeSignal: {
  //  type: "Non-Interactive",
  //  claimerInput: {
  //    inputType: "User generated data",
  //    sensorData: "Gyroscope",
  //    userData: "None",
  //  },
  //  description:
  //    "Approval via a sensor that sends a signal. The token creator specifies the sensor via its ID.",
  //  address: "",
  //},
  ApprovalByGroupMember: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "None",
      sensorData: "None",
      userData: "GroupID",
    },
    description:
      "The token creator specifies one or more user groups, of which one member has to approve.",
    address: "",
  },
  SpecificAddress: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "None",
      sensorData: "None",
      userData: "Address",
    },
    description: "The claimer specifies an address, which has to approve.",
    address: "",
  },
  LimitedVoting: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "File",
    },
    description: "The proof is sent to the users due to a random mechanism",
    address: "",
  },
  // verifiers that are commented out are not deployed in 2_deploy_contracts.js yet
  //MaximumQuantityPerInterval: {
    // chain: "On-Chain",
  //  type: "Non-Inveractive",
  //  claimerInput: {
  //    inputType: "None",
  //    sensorData: "None",
  //    userData: "None",
  //  },
  //  description:
  //    "Defines the maximum quantity a user can claim within a specified time interval.",
  //  address: "",
  //},
  //MinimumInterval: {
    // chain: "On-Chain",
  //  type: "Non-Inveractive",
  //  claimerInput: {
  //    inputType: "None",
  //    sensorData: "None",
  //    userData: "None",
  //  },
  //  description: "Defines a minimum time that has to pass between claims.",
  //  address: "",
  //},
  PictureVoting: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "Picture",
    },
    description:
      "The claimer has to supply a picture, based on which the approver will decide to approve.",
    address: "",
  },
  TokenCreatorApproval: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "None",
      sensorData: "None",
      userData: "None",
    },
    description: "The token creator has to approve.",
    address: "",
  },
  VideoVoting: {
    chain: "On-Chain",
    type: "Social",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "Video",
    },
    description:
      "The claimer has to supply a video, based on which the approver will decide to approve.",
    address: "",
  },
  ClaimableOnlyNTimesPerUser: {
    chain: "On-Chain",
    type: "Non-Interactive",
    claimerInput: {
      inputType: "None",
      sensorData: "None",
      userData: "None",
    },
    description:
      "The token creator sets a cap how many times a token can be successfully claimed",
    address: "",
  },
};

exports.verifiers = verifiers;
exports.verifierOptions = verifierOptions;

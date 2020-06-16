/* Verifiers file contains meta data and contract address of all used verifiers
 * Data is used for searching possible verifiers in token creation process
 */

const verifierOptions = {
  type: {
    values: ["Non-Interactive", "Interactive", "Both"],
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
      values: ["None", "Location", "Time"],
      description:
        "Determines if and which sensor data must be provided by the claimer.",
    },
    userData: {
      values: ["None", "Picture", "Video", "Password", "Address"],
      description:
        "Determines if and which content must be uploaded by the claimer.",
    },
  },
};

const verifiers = {
  Password: {
    type: "Non-Interactive",
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
    type: "Interactive",
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
  Location: {
    type: "Non-Interactive",
    claimerInput: {
      inputType: "User generated data",
      sensorData: "None",
      userData: "Location",
    },
    description:
      "A location, which is within a radius of a location the token creator defines, needs to be provided.",
    address: "",
  },
};

exports.verifiers = verifiers;
exports.verifierOptions = verifierOptions;

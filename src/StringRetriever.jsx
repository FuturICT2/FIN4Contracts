import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';

class StringRetriever extends Component {
    constructor(props, context) {
        super(props);
        this.contracts = context.drizzle.contracts;

        const web3 = new Web3(window.web3.currentProvider);
        var Fin4TokenJson = require('./build/contracts/Fin4Token.json');

        var Fin4TokenConfig = {
            contractName: this.props.tokenAdr,
            web3Contract: new web3.eth.Contract(Fin4TokenJson.abi, this.props.tokenAdr)
        }
        context.drizzle.addContract(Fin4TokenConfig);

        this.state = {
            dataKeyName: this.contracts[this.props.tokenAdr].methods[this.props.attribute].cacheCall()
        };
    }

    render() {
        if (!this.props.contracts[this.props.tokenAdr]) {
            return "Retrieving token name...";
        }
        if (!this.props.contracts[this.props.tokenAdr].initialized) {
            return "Initializing";
        }
        if (!(this.state.dataKeyName in this.props.contracts[this.props.tokenAdr][this.props.attribute])) {
            return "Fetching";
        }
        var attribute = this.props.contracts[this.props.tokenAdr][this.props.attribute][this.state.dataKeyName].value;
        return <>{attribute}</>
    }
}

StringRetriever.contextTypes = {
    drizzle: PropTypes.object
};

const mapStateToProps = state => {
    return {
        contracts: state.contracts
    };
};

export default drizzleConnect(StringRetriever, mapStateToProps);

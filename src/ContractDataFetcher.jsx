import { drizzleConnect } from 'drizzle-react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Web3 from 'web3';

class ContractDataFetcher extends Component {
	constructor(props, context) {
		super(props);
        this.contracts = context.drizzle.contracts;
        
        this.contractAddressOrName = "";

        if (this.props.contractAddress) {
            const web3 = new Web3(window.web3.currentProvider);
            var Fin4TokenJson = require('./build/contracts/Fin4Token.json');

            var Fin4TokenConfig = {
                contractName: this.props.contractAddress,
                web3Contract: new web3.eth.Contract(Fin4TokenJson.abi, this.props.contractAddress)
            }
            context.drizzle.addContract(Fin4TokenConfig);

            this.contractAddressOrName = this.props.contractAddress;
        } else {
            this.contractAddressOrName = this.props.contractName;
        }

        this.state = {
            dataKey: undefined
        };

        setTimeout(() => {
            this.setState({
                dataKey: this.contracts[this.contractAddressOrName].methods[this.props.method].cacheCall()
            });
        }, 1000)
    }

	render() {
        if (this.state.dataKey === undefined) {
            return "";
        }

        if (!this.contracts[this.contractAddressOrName]) {
            return "";
        }

		if (!this.props.contracts[this.contractAddressOrName].initialized) {
			return ""; // <span>Initializing...</span>;
		}

		if (!(this.state.dataKey in this.props.contracts[this.contractAddressOrName][this.props.method])) {
			return ""; // <span>Fetching...</span>;
		}

		var displayData = this.props.contracts[this.contractAddressOrName][this.props.method][this.state.dataKey].value;

		if (this.props.callback) {
			return this.props.callback(displayData);
        }

        return displayData;
	}
}

ContractDataFetcher.contextTypes = {
	drizzle: PropTypes.object
};

ContractDataFetcher.propTypes = {
	contracts: PropTypes.object.isRequired
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(ContractDataFetcher, mapStateToProps);

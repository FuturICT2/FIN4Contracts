// adapted from https://github.com/trufflesuite/drizzle-react-components/blob/develop/src/ContractData.js

import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ContractData extends Component {
	constructor(props, context) {
		super(props);

		// Fetch initial value from chain and return cache key for reactive updates.
		var methodArgs = this.props.methodArgs ? this.props.methodArgs : [];

		this.contracts = context.drizzle.contracts;
		this.state = {
			dataKey: this.contracts[this.props.contract].methods[
				this.props.method
			].cacheCall(...methodArgs)
		};
	}

	// Will not fix legacy component
	// eslint-disable-next-line react/no-deprecated
	componentWillReceiveProps(nextProps) {
		const { methodArgs, contract, method } = this.props;

		const didContractChange = contract !== nextProps.contract;
		const didMethodChange = method !== nextProps.method;
		const didArgsChange =
			JSON.stringify(methodArgs) !== JSON.stringify(nextProps.methodArgs);

		if (didContractChange || didMethodChange || didArgsChange) {
			this.setState({
				dataKey: this.contracts[nextProps.contract].methods[
					nextProps.method
				].cacheCall(...nextProps.methodArgs)
			});
		}
	}

	render() {
		// Contract is not yet intialized.
		if (!this.props.contracts[this.props.contract].initialized) {
			return <span>Initializing...</span>;
		}

		// If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
		if (
			!(
				this.state.dataKey in
				this.props.contracts[this.props.contract][this.props.method]
			)
		) {
			return <span>Fetching...</span>;
		}

		var displayData = this.props.contracts[this.props.contract][
			this.props.method
		][this.state.dataKey].value;

		if (this.props.callback) {
			return this.props.callback(displayData);
		}
	}
}

ContractData.contextTypes = {
	drizzle: PropTypes.object
};

ContractData.propTypes = {
	contracts: PropTypes.object.isRequired,
	contract: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	methodArgs: PropTypes.array,
	hideIndicator: PropTypes.bool,
	toUtf8: PropTypes.bool,
	toAscii: PropTypes.bool,
	render: PropTypes.func
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(ContractData, mapStateToProps);

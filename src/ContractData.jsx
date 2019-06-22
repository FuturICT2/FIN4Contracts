// adapted from https://github.com/trufflesuite/drizzle-react-components/blob/develop/src/ContractData.js

import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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

		// Show a loading spinner for future updates.
		var pendingSpinner = this.props.contracts[this.props.contract].synced
			? ''
			: ' 🔄';

		// Optionally hide loading spinner (EX: ERC20 token symbol).
		if (this.props.hideIndicator) {
			pendingSpinner = '';
		}

		var displayData = this.props.contracts[this.props.contract][
			this.props.method
		][this.state.dataKey].value;

		// Optionally convert to UTF8
		if (this.props.toUtf8) {
			displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData);
		}

		// Optionally convert to Ascii
		if (this.props.toAscii) {
			displayData = this.context.drizzle.web3.utils.hexToAscii(displayData);
		}

		// If a render prop is given, have displayData rendered from that component
		if (this.props.render) {
			return this.props.render(displayData);
		}

		// If return value is an array
		if (Array.isArray(displayData)) {
			const displayListItems = displayData.map((datum, index) => {
				return (
					<li key={index}>
						{`${datum}`}
						{pendingSpinner}
					</li>
				);
			});

			return <ul>{displayListItems}</ul>;
		}

		// If retun value is an object
		if (typeof displayData === 'object') {
			console.log(JSON.stringify(displayData))
			return (<span></span>
				// <Paper>
				// 	<Table>
				// 		<TableHead>
				// 			<TableRow>
				// 				{Object.values(displayData)[0].map((key, index) => {
				// 					return (<TableCell key={index}>{key}</TableCell>)
				// 				})}
				// 			</TableRow>
				// 		</TableHead>
				// 		<TableBody>
				// 			{Object.values(displayData).forEach(columns => {
				// 				return (<TableRow>
				// 					{/* {columns} */}
				// 				</TableRow>)
				// 			})}
				// 		</TableBody>
				// 	</Table>
				// </Paper>
			)
		}

		return (
			<span>
				{`${displayData}`}
				{pendingSpinner}
			</span>
		);
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

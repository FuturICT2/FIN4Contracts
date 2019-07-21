import React, { Component } from 'react';
import Currency from './Currency';
import { Select, MenuItem, InputLabel } from '@material-ui/core';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from './Contractor';

class DropdownActionType extends Component {
	constructor(props, context) {
		super(props);

		this.state = {
			tokens: []
		};

		getContractData('Fin4Main', 'Fin4Main.json', 'getChildren', [], context.drizzle)
			.then(tokens => {
				return tokens.map(address => {
					return getContractData(address, 'Fin4Token.json', 'getInfo', [], context.drizzle).then(
						({ 0: name, 1: symbol }) => {
							return {
								address: address,
								name: name,
								symbol: symbol
							};
						}
					);
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				this.setState({ tokens: data });
			});
	}

	render() {
		const menuItems = this.state.tokens.map((token, index) => {
			return (
				<MenuItem key={index} value={token.address}>
					<Currency symbol={token.symbol} name={token.name} />
				</MenuItem>
			);
		});

		return (
			<>
				<InputLabel htmlFor="select-action">Token Type</InputLabel>
				<Select
					name="tokenAddress"
					style={inputFieldStyle}
					value={this.props.value}
					displayEmpty
					inputProps={{
						id: 'select-action'
					}}
					onChange={this.props.handleChange}>
					<MenuItem value="">
						<em>Please Select</em>
					</MenuItem>
					{menuItems}
				</Select>
			</>
		);
	}
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

DropdownActionType.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(DropdownActionType, mapStateToProps);

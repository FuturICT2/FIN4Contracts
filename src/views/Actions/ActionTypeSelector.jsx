import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import StringRetriever from '../../StringRetriever';

class ActionTypeSelector extends Component {
	constructor(props, context) {
		super(props);
		this.contracts = context.drizzle.contracts;
		this.state = {
			selected: 'None',
			dataKey: this.contracts.Fin4Main.methods.getChildren.cacheCall()
		};
		this.contractsInfoObj = {};
	}

	storeAttribute = (tokenAdr, attribute, value) => {
		if (!this.contractsInfoObj[tokenAdr]) {
			this.contractsInfoObj[tokenAdr] = {};
		}
		this.contractsInfoObj[tokenAdr][attribute] = value;
	};

	handleChange = event => {
		this.setState({ selected: event.target.value, name: event.target.name });
		this.props.onChange(event, this.contractsInfoObj[event.target.value]);
	};

	render() {
		if (!this.props.contracts.Fin4Main.initialized) {
			return <span>Initializing...</span>;
		}

		if (!(this.state.dataKey in this.props.contracts.Fin4Main.getChildren)) {
			return <span>Fetching...</span>;
		}

		var tokenAddressArr = this.props.contracts.Fin4Main.getChildren[this.state.dataKey].value;

		const menuItems = tokenAddressArr
			? tokenAddressArr.map((tokenAdr, i) => {
					return (
						<MenuItem key={i} value={tokenAdr}>
							<span style={{ fontWeight: 'bold' }}>
								<StringRetriever tokenAdr={tokenAdr} attribute="name" callback={this.storeAttribute} />
							</span>
							&nbsp;
							<span>
								[
								<StringRetriever tokenAdr={tokenAdr} attribute="symbol" callback={this.storeAttribute} />]
							</span>
						</MenuItem>
					);
			  })
			: [];

		return (
			<>
				<InputLabel shrink htmlFor="select-action">
					action
				</InputLabel>
				<Select
					displayEmpty
					key="select"
					inputProps={{
						name: 'action',
						id: 'select-action'
					}}
					style={{
						width: '100%',
						marginBottom: '15px'
					}}
					value={this.state.selected}
					onChange={this.handleChange}>
					{menuItems}
				</Select>
			</>
		);
	}
}

ActionTypeSelector.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(ActionTypeSelector, mapStateToProps);

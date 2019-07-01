import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import { Container, Box } from '../../Styles';
import ContractData from '../../ContractData';
import PreviousClaims from './PreviousClaims';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';

class Actions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: 'None',
			selectedActionTypeAddress: null
		};
	}

	handleChange = event => {
		this.setState({
			selected: event.target.value,
			selectedActionTypeAddress: event.target.value
		});
	};

	addressToTokenInfo = data => {
		var name = data[0];
		var symbol = data[1];
		return (
			<>
				<span style={{ fontWeight: 'bold' }}>{name}</span>
				&nbsp;
				<span>[{symbol}]</span>
			</>
		);
	};

	mapChildrenToSelector = data => {
		var menuItems = data.map((address, index) => {
			return (
				<MenuItem key={index} value={address}>
					<ContractData key={index} contractAddress={address} method="getInfo" callback={this.addressToTokenInfo} />
				</MenuItem>
			);
		});

		return (
			<>
				<InputLabel shrink htmlFor="select-action">
					action
				</InputLabel>
				<Select
					displayEmpty
					key="select"
					inputProps={{
						id: 'select-action'
					}}
					style={{
						width: '100%',
						marginBottom: '15px'
					}}
					value={this.state.selected}
					onChange={this.handleChange}>
					<MenuItem value="None">
						<em>None</em>
					</MenuItem>
					{menuItems}
				</Select>
			</>
		);
	};

	render() {
		return (
			<Container>
				<div>
					<Box title={'Claim an Action'}>
						<ContractData contractName="Fin4Main" method="getChildren" callback={this.mapChildrenToSelector} />
						{this.state.selectedActionTypeAddress !== 'None' && (
							<ContractForm contractAddress={this.state.selectedActionTypeAddress} method="submit" />
						)}
					</Box>

					<Box title="Create a New Action Type">
						<ContractForm contractName="Fin4Main" method="createNewToken" />
					</Box>
				</div>

				<PreviousClaims />
			</Container>
		);
	}
}

export default Actions;

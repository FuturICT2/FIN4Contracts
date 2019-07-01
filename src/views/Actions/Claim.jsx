import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import { Box } from '../../Styles';
import ContractData from '../../ContractData';
import { Select, MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';

class ActionClaim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedActionTypeAddress: 'None'
		};
	}

	handleChange = event => {
		console.log(event);
		this.setState({
			selectedActionTypeAddress: event.target.value
		});
	};

	showActionTypes = data => {
		const menuItems =
			data &&
			data.map((address, index) => {
				return (
					<MenuItem key={index} value={address}>
						<ContractData
							contractAddress={address}
							method="getInfo"
							callback={({ 0: name, 1: symbol }) => {
								return (
									<>
										<span style={{ fontWeight: 'bold' }}>{name}</span>
										&nbsp;
										<span>[{symbol}]</span>
									</>
								);
							}}
						/>
					</MenuItem>
				);
			});

		return (
			<>
				<InputLabel shrink htmlFor="select-action">
					action
				</InputLabel>
				<Select
					value={this.state.selectedActionTypeAddress}
					displayEmpty
					key="select"
					inputProps={{
						id: 'select-action'
					}}
					style={{
						width: '100%',
						marginBottom: '15px'
					}}
					onChange={this.handleChange}>
					<MenuItem value="None" key="None">
						<em>Please Select</em>
					</MenuItem>
					{menuItems}
				</Select>
			</>
		);
	};

	render() {
		return (
			<Box title={'Claim an Action'}>
				<ContractData contractName="Fin4Main" method="getChildren" callback={this.showActionTypes} />
				{this.state.selectedActionTypeAddress !== 'None' && (
					<ContractForm contractAddress={this.state.selectedActionTypeAddress} method="submit" />
				)}
			</Box>
		);
	}
}

export default ActionClaim;

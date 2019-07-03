import React, { Component } from 'react';
import ContractForm from '../../ContractForm';
import { Fin4Box } from '../../Elements';
import ContractData from '../../ContractData';
import { Select, MenuItem, InputLabel } from '@material-ui/core';

class Claim extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedActionTypeAddress: ''
		};
	}

	handleChange = event => {
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
					inputProps={{
						id: 'select-action'
					}}
					style={{
						width: '100%',
						marginBottom: '15px'
					}}
					onChange={this.handleChange}>
					<MenuItem value="" key={-1}>
						<em>Please Select</em>
					</MenuItem>
					{menuItems}
				</Select>
			</>
		);
	};

	render() {
		return (
			<Fin4Box title={'Claim an Action'}>
				<ContractData contractName="Fin4Main" method="getChildren" callback={this.showActionTypes} />
				{this.state.selectedActionTypeAddress !== '' && (
					<ContractForm contractAddress={this.state.selectedActionTypeAddress} method="submit" />
				)}
			</Fin4Box>
		);
	}
}

export default Claim;

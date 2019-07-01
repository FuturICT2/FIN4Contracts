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
			selectedActionTypeAddress: 'None'
		};
	}

	handleChange = event => {
		this.setState({
			selectedActionTypeAddress: event.target.value
		});
	};

	showActionTypes = data => {
		var menuItems = data
			? data.map((address, index) => {
					return (
						<MenuItem key={index} value={address}>
							<ContractData
								key={index}
								contractAddress={address}
								method="getInfo"
								callback={data => {
									return (
										<>
											<span style={{ fontWeight: 'bold' }}>{data[0]}</span> {/* name */}
											&nbsp;
											<span>[{data[1]}]</span> {/* symbol */}
										</>
									);
								}}
							/>
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
						<ContractData contractName="Fin4Main" method="getChildren" callback={this.showActionTypes} />
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

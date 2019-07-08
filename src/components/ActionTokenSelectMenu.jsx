import React, { Component } from 'react';
import ContractData from '../components/ContractData';
import { Select, MenuItem, InputLabel } from '@material-ui/core';

class ActionTokenSelectMenu extends Component {
	constructor(props) {
		super(props);
	}

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
	};

	render() {
		return (
			<>
				<ContractData contractName="Fin4Main" method="getChildren" callback={this.showActionTypes} />
			</>
		);
	}
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};
export default ActionTokenSelectMenu;

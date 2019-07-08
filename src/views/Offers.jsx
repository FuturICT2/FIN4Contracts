import React, { Component } from 'react';
import Box from '../components/Box';
import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ContractData from '../components/ContractData';
import { Select, MenuItem, InputLabel } from '@material-ui/core';
import Database from '../components/Database';

class Offers extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			quantity: '',
			tokenAddress: '',
			receiverAddress: '',
			offerUrl: '',
			imagePath: ''
		};
		this.database = new Database();
		this.handleChange = this.handleChange.bind(this);
	}
	handleChange(event) {
		if (event.target.name == 'tokenAddress') {
			this.setState({ selectedActionTypeAddress: event.target.value });
		}
		this.setState({ [event.target.name]: event.target.value });
	}

	render() {
		const title = (
			<>
				<span>Create a New Offer </span>
			</>
		);
		return (
			<Box title={title}>
				<form>
					<ContractData contractName="Fin4Main" method="getChildren" callback={this.showActionTypes} />
					<TextField
						name="name"
						label="Name"
						style={inputFieldStyle}
						value={this.state.name}
						onChange={this.handleChange}
					/>
					<TextField
						name="description"
						label="Description"
						style={inputFieldStyle}
						value={this.state.description}
						onChange={this.handleChange}
					/>
					<TextField
						name="quantity"
						label="Quantity"
						style={inputFieldStyle}
						value={this.state.quantity}
						type="number"
						onChange={this.handleChange}
					/>
					<TextField
						name="receiverAddress"
						label="Account Addess"
						style={inputFieldStyle}
						value={this.state.receiverAddress}
						onChange={this.handleChange}
					/>
					<TextField
						name="imagePath"
						label="Image Url"
						style={inputFieldStyle}
						value={this.state.imagePath}
						onChange={this.handleChange}
					/>
					<TextField
						name="offerUrl"
						label="Offer Url"
						style={inputFieldStyle}
						value={this.state.offerUrl}
						onChange={this.handleChange}
					/>
					<p style={{ textAlign: 'center' }}>
						<Button
							key="submit"
							variant="contained"
							color="primary"
							onClick={this.database.saveOfferDetails(
								this.state.name,
								this.state.description,
								this.state.tokenAddress,
								this.state.receiverAddress,
								this.state.imagePath,
								this.state.offerUrl
							)}>
							<AddIcon /> &nbsp;Submit
						</Button>
					</p>
				</form>
			</Box>
		);
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
					value={this.state.selectedActionTypeAddress}
					displayEmpty
					inputProps={{
						id: 'select-action'
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
}
const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

export default Offers;

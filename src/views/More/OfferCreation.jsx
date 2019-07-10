import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Database from '../../components/Database';
import Box from '../../components/Box';
import DropdownActionType from '../../components/DropdownActionType';

class OfferCreation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			quantity: '',
			tokenaddress: '',
			accountaddress: '',
			offerurl: '',
			imageurl: '',
			type: props.offerType,
			selectedActionTypeAddress: ''
		};

		this.database = new Database();
	}
	handleChange = event => {
		if (event.target.name === 'tokenAddress') {
			this.setState({ selectedActionTypeAddress: event.target.value });
		}
		this.setState({ [event.target.name]: event.target.value });
	};

	onclickSubmit = () => {
		console.log('OnClick Submit');
		this.props.toggleModal();
		console.log(this.state.name);
		new Database().saveOfferDetails(
			this.state.name,
			this.state.description,
			this.state.tokenaddress,
			this.state.accountaddress,
			this.state.imageurl,
			this.state.offerurl,
			this.state.quantity,
			this.state.type
		);
	};

	render() {
		return (
			<Box>
				<form autoComplete="off">
					<DropdownActionType handleChange={this.handleChange} value={this.state.selectedActionTypeAddress} />
					{['Name', 'Description', 'Quantity', 'Account Address', 'Image URL', 'Offer URL'].map(fieldName => {
						const varName = fieldName.toLowerCase().replace(/\s+/g, '');
						return (
							<TextField
								name={varName}
								label={fieldName}
								style={inputFieldStyle}
								value={this.state[varName]}
								onChange={this.handleChange}
							/>
						);
					})}
					<p style={{ textAlign: 'center' }}>
						<Button key="submit" variant="contained" color="primary" onClick={this.onclickSubmit}>
							<AddIcon /> &nbsp;Submit
						</Button>
					</p>
				</form>
			</Box>
		);
	}
}
const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

export default OfferCreation;

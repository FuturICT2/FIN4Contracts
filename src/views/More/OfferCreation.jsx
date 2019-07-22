import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '../../components/Button';
import Database from '../../components/Database';
import Box from '../../components/Box';
import DropdownActionType from '../../components/DropdownActionType';

class OfferCreation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			quantity: '1',
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
			return;
		}
		this.setState({ [event.target.name]: event.target.value });
	};

	handleSubmit = event => {
		event.preventDefault();
		this.props.toggleModal();
		new Database().saveOfferDetails(
			this.state.name,
			this.state.description,
			this.state.selectedActionTypeAddress,
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
					{['Name', 'Description', 'Account Address', 'Image URL', 'Offer URL'].map(fieldName => {
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
					<Button icon={AddIcon} onClick={this.handleSubmit} center>
						Submit
					</Button>
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

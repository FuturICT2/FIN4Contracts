import React, { Component } from 'react';
import { TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '../../components/Button';
import Database from '../../components/Database';
import { getAllActionTypes } from '../../components/Contractor';
import Dropdown from '../../components/Dropdown';

class OfferCreation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tokens: []
		};

		this.newOfferFormData = {
			name: '',
			description: '',
			selectedActionTypeAddress: '',
			receiveraccountaddress: '',
			imageurl: '',
			offerurl: '',
			quantity: '1',
			type: props.offerType
		};

		getAllActionTypes().then(data => {
			this.setState({ tokens: data });
		});

		this.database = new Database();
	}
	handleChange = event => {
		if (event.value) {
			this.newOfferFormData.selectedActionTypeAddress = event.value;
		} else {
			this.newOfferFormData[event.target.name] = event.target.value;
		}
	};

	handleSubmit = event => {
		event.preventDefault();
		this.props.toggleModal();
		new Database().saveOfferDetails(
			this.newOfferFormData.name,
			this.newOfferFormData.description,
			this.newOfferFormData.selectedActionTypeAddress,
			this.newOfferFormData.receiveraccountaddress,
			this.newOfferFormData.imageurl,
			this.newOfferFormData.offerurl,
			this.newOfferFormData.quantity,
			this.newOfferFormData.type
		);
	};

	render() {
		return (
			<>
				<form autoComplete="off">
					<Dropdown onChange={this.handleChange} options={this.state.tokens} label="Action Type" />
					{['Name', 'Description', 'Receiver Account Address', 'Image URL', 'Offer URL'].map(fieldName => {
						const varName = fieldName.toLowerCase().replace(/\s+/g, '');
						return <TextField name={varName} label={fieldName} style={inputFieldStyle} onChange={this.handleChange} />;
					})}
					<Button icon={AddIcon} onClick={this.handleSubmit} center>
						Submit
					</Button>
				</form>
			</>
		);
	}
}
const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

export default OfferCreation;

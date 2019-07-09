import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Database from '../components/Database';
import ActionTokenSelectMenu from '../components/ActionTokenSelectMenu';

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
			imagePath: '',
			type: props.offerType
		};

		this.database = new Database();
		this.handleChange = this.handleChange.bind(this);
		this.onclickSubmit = this.onclickSubmit.bind(this);
	}
	handleChange(event) {
		if (event.target.name === 'tokenAddress') {
			this.setState({ selectedActionTypeAddress: event.target.value });
		}
		this.setState({ [event.target.name]: event.target.value });
	}

	onclickSubmit() {
		console.log('OnClick Submit');
		this.props.toggleModal();
		console.log(this.state.name);
		new Database().saveOfferDetails(
			this.state.name,
			this.state.description,
			this.state.tokenAddress,
			this.state.receiverAddress,
			this.state.imagePath,
			this.state.offerUrl,
			this.state.quantity,
			this.state.type
		);
	}

	render() {
		return (
			<form>
				<ActionTokenSelectMenu
					handleChange={this.handleChange.bind(this)}
					value={this.state.selectedActionTypeAddress}
				/>
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
					<Button key="submit" variant="contained" color="primary" onClick={this.onclickSubmit}>
						<AddIcon /> &nbsp;Submit
					</Button>
				</p>
			</form>
		);
	}
}
const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

export default Offers;

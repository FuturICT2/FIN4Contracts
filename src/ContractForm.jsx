import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import DateFnsUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';


const translateType = type => {
	switch (true) {
		case /^uint/.test(type):
			return 'number';
		case /^string/.test(type) || /^bytes/.test(type):
			return 'text';
		case /^bool/.test(type):
			return 'checkbox';
		default:
			return 'text';
	}
};

class ContractForm extends Component {
	constructor(props, context) {
		super(props);

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.contracts = context.drizzle.contracts;
		this.utils = context.drizzle.web3.utils;

		// Get the contract ABI
		const abi = this.contracts[this.props.contract].abi;

		this.inputs = [];
		var initialState = {
			dates: this.inputs
				.filter((input, index) => this.props.labels[index] === 'date')
				.map(input => new Date())
		};

		// Iterate over abi for correct function.
		for (var i = 0; i < abi.length; i++) {
			if (abi[i].name === this.props.method) {
				this.inputs = abi[i].inputs;

				for (var j = 0; j < this.inputs.length; j++) {
					initialState[this.inputs[j].name] = '';
				}

				break;
			}
		}

		this.state = initialState;
	}

	handleSubmit(event) {
		event.preventDefault();

		const convertedInputs = this.inputs.map(input => {
			if (input.type === 'bytes32') {
				return this.utils.toHex(this.state[input.name]);
			}
			return this.state[input.name];
		});

		if (this.props.sendArgs) {
			return this.contracts[this.props.contract].methods[
				this.props.method
			].cacheSend(...convertedInputs, this.props.sendArgs);
		}

		return this.contracts[this.props.contract].methods[
			this.props.method
		].cacheSend(...convertedInputs);
	}

	handleInputChange(event) {
		const value =
			event.target.type === 'checkbox'
				? event.target.checked
				: event.target.value;
		this.setState({ [event.target.name]: value });
	}

	render() {
		if (this.props.render) {
			return this.props.render({
				inputs: this.inputs,
				inputTypes: this.inputs.map(input => translateType(input.type)),
				state: this.state,
				handleInputChange: this.handleInputChange,
				handleSubmit: this.handleSubmit
			});
		}


		return (
			<StyledPaper >
				<form
				className="pure-form pure-form-stacked"
				onSubmit={this.handleSubmit}>
				{this.inputs.map((input, index) => {
					var inputType = translateType(input.type);
					var inputLabel = this.props.labels
						? this.props.labels[index]
						: input.name;
					return inputLabel === 'date' ? (
						<p>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<DatePicker
								key={input.name}
								id={input.name}
								label={inputLabel}
								value={this.state.dates[index]}
								onChange={x => this.handleInputChange(x.getTime())}
							/>
						</MuiPickersUtilsProvider> 
						</p>
					) : (
						<p>
						<TextField
							key={input.name}
							id={input.name}
							type={inputType}
							label={inputLabel}
							onChange={this.handleInputChange}
						/>
						</p>
					);
				})}
				<Button variant="contained" color="primary" onClick={this.handleSubmit}>
					<AddIcon/> &nbsp;
					Submit
				</Button>
			</form>
		 </StyledPaper>
		);
	}
}


ContractForm.contextTypes = {
	drizzle: PropTypes.object
};

ContractForm.propTypes = {
	contract: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	sendArgs: PropTypes.object,
	labels: PropTypes.arrayOf(PropTypes.string),
	render: PropTypes.func
};

const StyledPaper = styled(Paper)`
padding: 1em;
margin: 1em;
position: relative;
background: white;
fontSize: '15px';
`

/*
 * Export connected component.
 */

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(ContractForm, mapStateToProps);

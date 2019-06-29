import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';

import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import ActionTypeSelector from './ActionTypeSelector';
import Web3 from 'web3';

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
		this.context = context;

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.state = {};
		this.rebuild();
	}

	rebuild() {
		this.contracts = this.context.drizzle.contracts;
		this.utils = this.context.drizzle.web3.utils;

		if (this.props.contractAddress) {
			const web3 = new Web3(window.web3.currentProvider);

			var contractJson = 'Fin4Token.json';
			if (this.props.contractJson) {
				contractJson = this.props.contractJson;
			}

			var tokenJson = require('./build/contracts/Fin4Token.json');

			// needs time and has no callback -> timout below
			this.context.drizzle.addContract({
				contractName: this.props.contractAddress,
				web3Contract: new web3.eth.Contract(tokenJson.abi, this.props.contractAddress)
			});

			this.contractIdentifier = this.props.contractAddress;
		} else {
			this.contractIdentifier = this.props.contractName;
		}

		var initState = (self) => {
			// Get the contract ABI
			const abi = self.contracts[self.contractIdentifier].abi;

			this.inputs = [];
			var initialState = {
				dates: self.inputs
					.filter((input, index) => self.props.labels[index] === 'date')
					.map(input => new Date())
			};

			// Iterate over abi for correct function.
			for (var i = 0; i < abi.length; i++) {
				if (abi[i].name === self.props.method) {
					self.inputs = abi[i].inputs;
					for (var j = 0; j < self.inputs.length; j++) {
						initialState[self.inputs[j].name] = '';
					}
					break;
				}
			}

			self.setState(initialState);
		}

		var init = () => {
			if (this.props.contractAddress) {
				var self = this;
				(new Web3(window.web3.currentProvider)).eth.getAccounts(function(error, result) {
					if (error != null) console.log("Couldn't get accounts");
					self.contracts[self.contractIdentifier].options.from = result[0];
					initState(self);
				});
			} else {
				initState(this);
			}
		}

		// conditional timout if addContract was called above
		var setDataKey = setInterval(() => {
			try {
				init();
				clearInterval(setDataKey);
			} catch (e) { }
		}, 10)
	}

	componentDidUpdate(previousProps) {
		if (this.props.contractName) {
			return;
		}
		const didContractChange = this.props.contractAddress !== previousProps.contractAddress;
		if (didContractChange) {
			this.rebuild();
		}	
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
			return this.contracts[this.contractIdentifier].methods[
				this.props.method
			].cacheSend(...convertedInputs, this.props.sendArgs);
		}

		return this.contracts[this.contractIdentifier].methods[
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
		if (!this.state.dates) { // better identifier then dates? TODO
			return "";
		}

		return (
			<Paper >
				<Typography variant="h5" component="h3">
					{this.props.title}
				</Typography>
				<form
					className="pure-form pure-form-stacked"
					onSubmit={this.handleSubmit}>
					{this.inputs.map((input, index) => {
						var inputType = translateType(input.type);
						var inputLabel = this.props.labels
							? this.props.labels[index]
							: input.name;

						if (inputLabel === 'date') {
							return (
								<MuiPickersUtilsProvider key={input.name} utils={DateFnsUtils}>
									<DatePicker
										key={input.name}
										name={input.name}
										label={inputLabel}
										value={this.state.dates[index]}
										onChange={x => {
											console.log('coming soon')
											// return this.handleInputChange(x)
										}}
										style={inputFieldStyle}
									/>
								</MuiPickersUtilsProvider>
							);
						}

						return (
							<TextField // renders the number field automatically by detecting the inputType
								key={input.name}
								name={input.name}
								multiline={inputLabel === 'comment'}
								type={inputType}
								label={inputLabel}
								onChange={this.handleInputChange}
								style={inputFieldStyle}
							/>
						);
					})}
					<p style={{ textAlign: "center" }}>
						<Button key="submit" variant="contained" color="primary" onClick={this.handleSubmit}>
							<AddIcon /> &nbsp;Submit
						</Button>
					</p>
				</form>
			</Paper >
		);
	}
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
}

ContractForm.contextTypes = {
	drizzle: PropTypes.object
};

ContractForm.propTypes = {
	// contract: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	sendArgs: PropTypes.object,
	labels: PropTypes.arrayOf(PropTypes.string),
};

/*
 * Export connected component.
 */

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(ContractForm, mapStateToProps);

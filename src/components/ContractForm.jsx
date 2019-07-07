// heavily adapted from https://github.com/trufflesuite/drizzle-react-components/blob/develop/src/ContractForm.js

import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DateFnsUtils from '@date-io/moment';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import Web3 from 'web3';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import Modal from './Modal';

const animatedComponents = makeAnimated();

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

		this.state = {};
		this.inputs = [];
		this.newValue = null;
		this.rebuild();
	}

	initState = self => {
		// Get the contract ABI
		const abi = self.contracts[self.contractIdentifier].abi;

		this.inputs = [];
		var initialState = {
			isPopupOpen: false,
			newValue: null
		};

		// Iterate over abi for correct function.
		for (var i = 0; i < abi.length; i++) {
			if (abi[i].name === self.props.method) {
				if (self.props.methodArgsCount && abi[i].inputs.length !== Number(self.props.methodArgsCount)) {
					continue;
				}

				self.inputs = abi[i].inputs;
				for (var j = 0; j < self.inputs.length; j++) {
					// set default date to today for date inputs
					initialState[self.inputs[j].name] = self.inputs[j].name === 'date' ? moment().valueOf() : '';
				}
				break;
			}
		}

		self.setState(initialState);
	};

	rebuild = () => {
		this.contracts = this.context.drizzle.contracts;
		this.utils = this.context.drizzle.web3.utils;

		if (this.props.contractAddress) {
			const web3 = new Web3(window.web3.currentProvider);

			var contractJson = 'Fin4Token.json';
			if (this.props.contractJson) {
				contractJson = this.props.contractJson;
			}

			var tokenJson = require('../build/contracts/' + contractJson);

			// needs time and has no callback -> timout below
			this.context.drizzle.addContract({
				contractName: this.props.contractAddress,
				web3Contract: new web3.eth.Contract(tokenJson.abi, this.props.contractAddress)
			});

			this.contractIdentifier = this.props.contractAddress;
		} else {
			this.contractIdentifier = this.props.contractName;
		}

		// conditional timout if addContract was called above
		var setDataKey = setInterval(() => {
			try {
				if (this.props.contractAddress) {
					var self = this;
					new Web3(window.web3.currentProvider).eth.getAccounts((error, result) => {
						if (error) console.log("Couldn't get accounts");
						self.contracts[self.contractIdentifier].options.from = result[0];
						this.initState(self);
					});
				} else {
					this.initState(this);
				}
				clearInterval(setDataKey);
			} catch (e) {}
		}, 10);
	};

	componentDidUpdate = previousProps => {
		if (this.props.contractName) {
			return;
		}
		const didContractChange = this.props.contractAddress !== previousProps.contractAddress;
		if (didContractChange) {
			this.rebuild();
		}
	};

	handleSubmit = event => {
		event.preventDefault();

		const convertedInputs = this.inputs.map(input => {
			if (this.props.fixArgs && this.props.fixArgs[input.name]) {
				return this.props.fixArgs[input.name];
			}
			if (input.type === 'bytes32') {
				return this.utils.toHex(this.state[input.name]);
			}
			return this.state[input.name];
		});

		if (this.props.sendArgs) {
			return this.contracts[this.contractIdentifier].methods[this.props.method].cacheSend(
				...convertedInputs,
				this.props.sendArgs
			);
		}

		return this.contracts[this.contractIdentifier].methods[this.props.method].cacheSend(...convertedInputs);
	};

	handleInputChange = event => {
		// removing the last tag in the multiselect field fires a null-event
		if (event === null && this.props.multiSelectOptions) {
			this.setState({ ['requiredProofTypes']: [] });
			return;
		}

		let value;

		if (!event.target && this.props.multiSelectOptions) {
			// indicator for react-select
			var values = [];
			for (var i = 0; i < event.length; i++) {
				values.push(event[i].value);
			}

			var newValue;
			if (this.state.requiredProofTypes.length == 0) {
				// first tag was added
				newValue = values[0];
			} else if (values.length < this.state.requiredProofTypes.length) {
				// a tag was removed
				newValue = null;
			} else {
				newValue = values[values.length - 1];
			}

			this.setState({
				['requiredProofTypes']: values,
				newValue: newValue
			});

			if (newValue != null) {
				// this.getProofTypeObj(newValue).label == "MinimumClaimingInterval"
				this.openPopup();
			}
			return;
		}

		if (event.target.type === 'checkbox') {
			value = event.target.checked;
		} else if (event.target.type === 'date') {
			value = moment(event.target.value).valueOf();
		} else {
			value = event.target.value;
		}

		this.setState({ [event.target.name]: value });
	};

	getProofTypeObj(address) {
		if (!this.props.multiSelectOptions) {
			return '';
		}
		for (var i = 0; i < this.props.multiSelectOptions.length; i++) {
			if (this.props.multiSelectOptions[i].value == address) {
				return this.props.multiSelectOptions[i];
			}
		}
		return '';
	}

	openPopup = () => {
		this.setState({ isPopupOpen: true });
	};

	closePopup = () => {
		this.setState({
			isPopupOpen: false,
			newValue: null
		});
	};

	render() {
		return (
			<>
				<Modal
					isOpen={this.state.isPopupOpen}
					handleClose={this.closePopup}
					title={'Set parameters for ' + this.getProofTypeObj(this.state.newValue).label}>
					<ContractForm
						contractAddress={this.state.newValue}
						contractJson={this.getProofTypeObj(this.state.newValue).label + '.json'}
						method="setParameters"
						//fixArgs={{
						//	tokenAddressUsingThisProofType: this.state.newValue
						//}}
					/>
				</Modal>
				<form onSubmit={this.handleSubmit} autoComplete="off">
					{this.inputs.map(({ name, type }, index) => {
						if (this.props.fixArgs && this.props.fixArgs[name]) {
							return '';
						}

						var inputType = translateType(type);
						var inputLabel = this.props.labels ? this.props.labels[index] : name;

						// if (inputLabel === 'requiredProofTypes' && this.props.multiSelectOptions) {
						// 	return (
						// 		<Select
						// 			isMulti
						// 			onChange={this.handleInputChange}
						// 			defaultValue={[]}
						// 			options={this.props.multiSelectOptions}
						// 			components={animatedComponents}
						// 		/>
						// 	);
						// }

						if (inputLabel === 'date') {
							const dateFormat = 'YYYY-MM-DD HH:mm';
							return (
								<MuiPickersUtilsProvider key={name} utils={DateFnsUtils}>
									<DateTimePicker
										ampm={false}
										disableFuture
										showTodayButton
										key={name}
										label={inputLabel}
										format={dateFormat}
										value={moment(this.state[name]).format(dateFormat)}
										onChange={moment =>
											this.handleInputChange({
												target: {
													name: name,
													value: moment,
													type: 'date'
												}
											})
										}
										style={inputFieldStyle}
									/>
								</MuiPickersUtilsProvider>
							);
						}

						return (
							<TextField // renders the number field automatically by detecting the inputType
								key={name}
								name={name}
								multiline={inputLabel === 'comment'}
								type={inputType}
								label={inputLabel}
								onChange={this.handleInputChange}
								style={inputFieldStyle}
							/>
						);
					})}
					<p style={{ textAlign: 'center' }}>
						<Button key="submit" variant="contained" color="primary" onClick={this.handleSubmit}>
							<AddIcon /> &nbsp;Submit
						</Button>
					</p>
				</form>
			</>
		);
	}
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

ContractForm.contextTypes = {
	drizzle: PropTypes.object
};

ContractForm.propTypes = {
	contractName: PropTypes.string,
	contractAddress: PropTypes.string,
	method: PropTypes.string.isRequired,
	methodArgsCount: PropTypes.string,
	sendArgs: PropTypes.object,
	labels: PropTypes.arrayOf(PropTypes.string)
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

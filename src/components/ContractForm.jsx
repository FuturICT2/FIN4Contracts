// heavily adapted from https://github.com/trufflesuite/drizzle-react-components/blob/develop/src/ContractForm.js

import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import Modal from './Modal';
import Dropdown from './Dropdown';
import Button from './Button';
import AddIcon from '@material-ui/icons/Add';
import OpenIcon from '@material-ui/icons/OpenInNew';
import DateFnsUtils from '@date-io/moment';
import moment from 'moment';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
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

		this.hasInit = false;
		this.state = {};
		this.inputs = [];
		this.newValue = null;
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
	}

	initState = self => {
		// Get the contract ABI
		const abi = self.contracts[self.contractIdentifier].abi;

		this.inputs = [];
		var initialState = {
			isModalOpen: false,
			newValue: null,
			tokenAddress: null,
			requiredProofTypes: []
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

		self.hasInit = true;
		self.setState(initialState);
	};

	handleSubmit = event => {
		if (this.props.toggleModal) {
			this.props.toggleModal();
		}
		event.preventDefault();

		if (this.props.multiSelectOptions && this.state.requiredProofTypes.length < 1) {
			alert('At least one proof type must be selected.');
			return;
		}

		if (this.props.singleSelectOptions && !this.state.tokenAddress) {
			alert('An action type must be chosen.');
			return;
		}

		var paramValuesIndicesArr = [];

		const convertedInputs = this.inputs.map(input => {
			if (this.props.fixArgs && this.props.fixArgs[input.name]) {
				return this.props.fixArgs[input.name];
			}

			if (this.props.hideArgs && this.props.hideArgs[input.name] && this.props.multiSelectOptions) {
				if (input.name === 'paramValues') {
					// expected to happen before paramValuesIndices
					var allParamValuesArr = [];
					for (var i = 0; i < this.state.requiredProofTypes.length; i++) {
						var proofTypeObj = this.getProofTypeObj(this.state.requiredProofTypes[i]);
						// console.log(proofTypeObj);
						var paramValuesObj = proofTypeObj.paramValues;
						var count = 0;
						var startIndex = allParamValuesArr.length;
						for (var key in paramValuesObj) {
							if (paramValuesObj.hasOwnProperty(key)) {
								allParamValuesArr.push(paramValuesObj[key]);
								count++;
							}
						}
						var endIndex = startIndex + count - 1;
						paramValuesIndicesArr.push(count === 0 ? 99 : startIndex); // 99 as indicator for no params for this ProofType
						paramValuesIndicesArr.push(count === 0 ? 99 : endIndex);
					}
					// console.log(paramValuesIndicesArr, allParamValuesArr);
					return allParamValuesArr;
				}

				if (input.name === 'paramValuesIndices') {
					return paramValuesIndicesArr;
				}

				return '';
			}

			if (input.name === 'tokenAddress' && this.props.singleSelectOptions) {
				return this.state.tokenAddress;
			}

			if (input.type === 'bytes32') {
				return this.utils.toHex(this.state[input.name]);
			}

			if (this.props.specialField && this.props.specialField.name === input.name) {
				return this.props.specialField.value;
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

	handleSingleSelectInputChange = event => {
		this.setState({ ['tokenAddress']: event.value });
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
			if (this.state.requiredProofTypes.length === 0) {
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

			if (newValue != null && this.getProofTypeObj(newValue).paramsEncoded.length > 0) {
				// this.getProofTypeObj(newValue).label === "MinimumClaimingInterval"
				this.openModal();
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
		for (var i = 0; this.props.multiSelectOptions && i < this.props.multiSelectOptions.length; i++) {
			if (this.props.multiSelectOptions[i].value === address) {
				return this.props.multiSelectOptions[i];
			}
		}
		return '';
	}

	openModal = () => {
		this.setState({ isModalOpen: true });
	};

	closeModal = () => {
		this.setState({
			isModalOpen: false,
			newValue: null
		});
	};

	handleParamChange = (proofTypeObj, event) => {
		proofTypeObj.paramValues[event.target.name] = Number(event.target.value);
		//event.target.type + ':' + event.target.name + '=' + event.target.value;
	};

	render() {
		if (!this.hasInit) {
			return '';
		}

		return (
			<>
				<Modal
					isOpen={this.state.isModalOpen}
					handleClose={this.closeModal}
					title={'Set Parameters for ' + this.getProofTypeObj(this.state.newValue).label}
					width="400px">
					{this.state.newValue &&
						this.getProofTypeObj(this.state.newValue)
							.paramsEncoded.split(',')
							.map(part => {
								const [paramType, paramName, unit] = part.split(':');
								return (
									<TextField
										key={paramName}
										name={paramName}
										type={translateType(paramType)}
										label={paramName + ' (' + unit + ')'}
										onChange={e => this.handleParamChange(this.getProofTypeObj(this.state.newValue), e)}
										style={inputFieldStyle}
									/>
								);
							})}
					<Button onClick={this.closeModal} center>
						Apply
					</Button>
				</Modal>
				<form onSubmit={this.handleSubmit} autoComplete="off">
					{this.inputs.map(({ name, type }, index) => {
						if (
							(this.props.fixArgs && this.props.fixArgs[name]) ||
							(this.props.hideArgs && this.props.hideArgs[name])
						) {
							return '';
						}

						const inputType = translateType(type);
						let inputLabel = this.props.labels ? this.props.labels[index] : name;
						// enrich inputLabel with modal trigger if available
						try {
							inputLabel = this.props.helperModalTriggers[index] ? (
								<HelperModalTrigger onClick={this.props.helperModalTriggers[index]}>{inputLabel}</HelperModalTrigger>
							) : (
								inputLabel
							);
						} catch {}

						if (name === 'requiredProofTypes' && this.props.multiSelectOptions) {
							return (
								<Dropdown
									key={name}
									multipleChoice
									onChange={this.handleInputChange}
									options={this.props.multiSelectOptions}
									label={inputLabel}
								/>
							);
						}

						if (this.props.specialField && name === this.props.specialField.name) {
							return (
								<>
									<Button icon={AddIcon} onClick={() => this.props.specialField.onClick(this.props.specialField)} center>
										{this.props.specialField.buttonText}
									</Button>
									<hr></hr>
								</>
							)
						}

						if (name === 'tokenAddress' && this.props.singleSelectOptions) {
							return (
								<Dropdown
									key={name}
									onChange={this.handleSingleSelectInputChange}
									options={this.props.singleSelectOptions}
									label={inputLabel}
								/>
							);
						}

						if (name === 'date') {
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
					<Button icon={AddIcon} onClick={this.handleSubmit} center>
						{this.props.buttonLabel ? this.props.buttonLabel : 'Submit'}
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

const HelperModalTrigger = props => {
	return (
		<span {...props} style={{ cursor: 'pointer' }}>
			{props.children} (Learn More <OpenIcon style={{ verticalAlign: 'middle' }} />)
		</span>
	);
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
	labels: PropTypes.arrayOf(PropTypes.string),
	helperModalTriggers: PropTypes.arrayOf(PropTypes.func)
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

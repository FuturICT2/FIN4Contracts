import React from 'react';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import styled from 'styled-components';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import OfferCreation from './OfferCreation';
import Modal from '../../components/Modal';
import bigchainConfig from '../../config/bigchain-config';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import { getContractData } from '../../components/Contractor';
import { Fin4MainAddress } from '../../config/DeployedAddresses.js';

class More extends React.Component {
	constructor(props, context) {
		super(props);
		this.state = {
			spendingOffers: [],
			donationOffers: [],
			isOfferModalOpen: false,
			isDonationModalOpen: false,
			tokenAddress: [],
			tokenInfosAndBalances: []
		};
		{
			this.getOfferData();
		}

		var currentAccount = window.web3.currentProvider.selectedAddress;

		getContractData(
			Fin4MainAddress,
			'Fin4Main',
			'getChildrenWhereUserHasNonzeroBalance',
			[currentAccount],
			context.drizzle
		)
			.then(tokenAddresses => {
				return tokenAddresses.map((address, index) => {
					return getContractData(address, 'Fin4Token', 'getInfoAndBalance', [currentAccount], context.drizzle).then(
						({ 0: name, 1: symbol, 2: balance }) => {
							return {
								address: address,
								name: name,
								symbol: symbol,
								balance: balance.toString()
							};
						}
					);
				});
			})
			.then(data => Promise.all(data))
			.then(data => {
				this.setState({ tokenInfosAndBalances: data });
			});
	}

	getOfferData() {
		['spendingOffers', 'donationOffers'].forEach(offers => {
			axios.get(`${bigchainConfig.path}assets?search=${offers}`).then(res => {
				const offersResult = res.data.filter(offer =>
					this.state.tokenAddress.includes(offer.data.offerData.tokenAddress)
				);
				this.setState({ [offers]: res.data }); // TODO use offersResult once this.state.tokenAddress is properly filled again
			});
		});
	}

	toggleOfferModal = () => {
		this.setState({ isOfferModalOpen: !this.state.isOfferModalOpen });
	};

	toggleDonationModal = () => {
		this.setState({ isDonationModalOpen: !this.state.isDonationModalOpen });
	};

	getTokenInfoByAddress = tokenAddress => {
		var arr = this.state.tokenInfosAndBalances;
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].address === tokenAddress) {
				return arr[i];
			}
		}
		return null;
	};

	render() {
		return (
			<Wrapper>
				<Fab color="primary" aria-label="Add" onClick={this.toggleOfferModal}>
					<AddIcon />
				</Fab>
				<Modal
					isOpen={this.state.isOfferModalOpen}
					handleClose={this.toggleOfferModal}
					title="Create a New Offer"
					width="500px">
					<OfferCreation offerType="spendingOffers" toggleModal={this.toggleOfferModal.bind(this)} />
				</Modal>

				<Wrapper>
					<div>
						{this.state.spendingOffers.map(({ data }, index) => {
							let tokenInfo = this.getTokenInfoByAddress(data.offerData.tokenAddress);
							if (tokenInfo === null) {
								return '';
							}
							return (
								<Card
									key={index}
									title={data.offerData.name}
									imagePath={data.offerData.imagePath}
									description={data.offerData.description}
									readMore={data.offerData.offerUrl}
									actionButtonText="redeem now"
									tokenInfo={tokenInfo}
									recipientAddress={data.offerData.receiverAddress}
									amount={data.offerData.quantity}
								/>
							);
						})}
					</div>
					<Container>
						<Box title="My Action Tokens">
							{this.state.tokenInfosAndBalances.length > 0 ? (
								<Table headers={['Name', 'Symbol', 'Balance']}>
									{this.state.tokenInfosAndBalances.map((entry, index) => {
										return (
											<TableRow
												key={index}
												data={{
													name: entry.name,
													symbol: entry.symbol,
													balance: entry.balance
												}}
											/>
										);
									})}
								</Table>
							) : (
								<center>You have no balance on any token yet.</center>
							)}
						</Box>
					</Container>
					<div>
						{this.state.tokenInfosAndBalances.length > 0 &&
							this.state.donationOffers.map(({ data }, index) => {
								let tokenInfo = this.getTokenInfoByAddress(data.offerData.tokenAddress);
								if (tokenInfo === null) {
									return '';
								}
								return (
									<Card
										key={index}
										title={data.offerData.name}
										imagePath={data.offerData.imagePath}
										description={data.offerData.description}
										readMore={data.offerData.offerUrl}
										actionButtonText="donate"
										tokenInfo={tokenInfo}
										recipientAddress={data.offerData.receiverAddress}
										amount={data.offerData.quantity}
									/>
								);
							})}
					</div>
				</Wrapper>

				<Fab color="primary" aria-label="Add" onClick={this.toggleDonationModal}>
					<AddIcon />
				</Fab>
				<Modal
					isOpen={this.state.isDonationModalOpen}
					handleClose={this.toggleDonationModal}
					title="Create a New Donation Offer"
					width="500px">
					<OfferCreation offerType="donationOffers" toggleModal={this.toggleDonationModal.bind(this)} />
				</Modal>
			</Wrapper>
		);
	}
}

const Wrapper = styled.div`
	display: flex;
	justify-content: space-evenly;
	align-items: center;
`;

More.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts
	};
};

export default drizzleConnect(More, mapStateToProps);

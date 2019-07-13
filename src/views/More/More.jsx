import React from 'react';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import ContractData from '../../components/ContractData';
import styled from 'styled-components';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import OfferCreation from './OfferCreation';
import Modal from '../../components/Modal';
import bigchainConfig from '../../config/bigchain-config';

const showBalanceByActionType = data => {
	return (
		<Box title="My Action Tokens">
			<Table headers={['Name', 'Symbol', 'Balance']}>
				{data &&
					data.map((address, index) => {
						return (
							<ContractData
								key={index}
								contractAddress={address}
								method="getInfoAndBalance"
								callback={data => <TableRow data={data} />}
							/>
						);
					})}
			</Table>
		</Box>
	);
};

class More extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spendingOffers: [],
			donationOffers: [],
			isOfferModalOpen: false,
			isDonationModalOpen: false,
			tokenAddress: []
		};
	}

	setTokenAddressWithBalance = tokenAddress => {
		return (
			<Wrapper>
				{this.setState({ tokenAddress })}
				{this.getOfferData()}
				<div>
					{this.state.spendingOffers.map(({ data }, index) => {
						return (
							<Card
								key={index}
								title={data.offerData.name}
								imagePath={data.offerData.imagePath}
								description={data.offerData.description}
								readMore={data.offerData.offerUrl}
								actionButtonText="redeem now"
								actionbuttonAddress={data.offerData.tokenAddress}
								recepientAddress={data.offerData.receiverAddress}
								amount={data.offerData.quantity}
							/>
						);
					})}
				</div>
				<Container>
					<ContractData contractName="Fin4Main" method="getChildrenWhereUserHasNonzeroBalance" callback={showBalanceByActionType} />
				</Container>
				<div>
					{this.state.donationOffers.map(({ data }, index) => {
						//console.log(data.offerData)
						return (
							<Card
								key={index}
								title={data.offerData.name}
								imagePath={data.offerData.imagePath}
								description={data.offerData.description}
								readMore={data.offerData.offerUrl}
								actionButtonText="donate"
								actionbuttonAddress={data.offerData.tokenAddress}
								recepientAddress={data.offerData.receiverAddress}
								amount={data.offerData.quantity}
							/>
						);
					})}
				</div>
			</Wrapper>
		);
	};

	getOfferData() {
		['spendingOffers', 'donationOffers'].forEach(offers => {
			axios.get(`${bigchainConfig.path}assets?search=${offers}`).then(res => {
				const offersResult = res.data.filter(offer =>
					this.state.tokenAddress.includes(offer.data.offerData.tokenAddress)
				);
				this.setState({ [offers]: offersResult });
			});
		});
	}

	toggleOfferModal = () => {
		this.setState({ isOfferModalOpen: !this.state.isOfferModalOpen });
	};

	toggleDonationModal = () => {
		this.setState({ isDonationModalOpen: !this.state.isDonationModalOpen });
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

				<ContractData
					contractName="Fin4Main"
					method="getAllTokenWithBalance"
					callback={this.setTokenAddressWithBalance}
				/>

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

export default More;

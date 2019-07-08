import React from 'react';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import ContractData from '../../components/ContractData';
import styled from 'styled-components';
import dummyData from '../../config/dummy-data';
import axios from 'axios';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import Offers from '../Offers';
import Modal from '../../components/Modal';

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
		this.state = { spendingOffers: [], donationOffers: [], isOfferPopupOpen: false, isDoantionPopupOpen: false };
		this.getSpendingOffers();
		this.getDonationOffers();
	}

	getSpendingOffers() {
		var PATH = 'http://localhost:9984/api/v1/assets?search=spendingOffers&limit=2';
		axios.get(PATH).then(res => {
			const spendingOffers = res.data;
			this.setState({ spendingOffers });
		});
	}
	getDonationOffers() {
		var PATH = 'http://localhost:9984/api/v1/assets?search=donationOffers&limit=2';
		axios.get(PATH).then(res => {
			const donationOffers = res.data;
			this.setState({ donationOffers });
		});
	}

	toggleOfferPopup = () => {
		console.log(this.state.isOfferPopupOpen);
		this.setState({ isOfferPopupOpen: !this.state.isOfferPopupOpen });
	};

	toggleDonationPopup = () => {
		console.log(this.state.isDoantionPopupOpen);
		this.setState({ isDoantionPopupOpen: !this.state.isDoantionPopupOpen });
	};

	render() {
		return (
			<Wrapper>
				<div>
					<Fab color="primary" aria-label="Add" onClick={this.toggleOfferPopup}>
						<AddIcon />
					</Fab>
					<Modal
						isOpen={this.state.isOfferPopupOpen}
						handleClose={this.toggleOfferPopup}
						title="Create a new Offer"
						width="500px">
						<Offers offerType="spendingOffers" />
					</Modal>

					{this.state.spendingOffers.map(({ data }, index) => {
						console.log(this.state.spendingOffers);
						return (
							<Card
								key={index}
								title={data.offerData.name}
								imagePath={data.offerData.imagePath}
								description={data.offerData.description}
								readMore={data.offerData.offerUrl}
								actionButtonText="redeem now"
							/>
						);
					})}
				</div>
				<Container>
					<ContractData contractName="Fin4Main" method="getChildren" callback={showBalanceByActionType} />
				</Container>
				<div>
					<Fab color="primary" aria-label="Add" onClick={this.toggleDonationPopup}>
						<AddIcon />
					</Fab>

					<Modal
						isOpen={this.state.isDoantionPopupOpen}
						handleClose={this.toggleDonationPopup}
						title="Create a new Donation Offer"
						width="500px">
						<Offers offerType="donationOffers" />
					</Modal>

					{this.state.donationOffers.map(({ data }, index) => {
						return (
							<Card
								key={index}
								title={data.offerData.name}
								imagePath={data.offerData.imagePath}
								description={data.offerData.description}
								readMore={data.offerData.offerUrl}
								actionButtonText="donate"
							/>
						);
					})}
				</div>
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

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
		this.state = { offers: [] };
		this.getOffers();
	}

	getOffers() {
		var PATH = 'http://localhost:9984/api/v1/assets?search=offer';
		axios.get(PATH).then(res => {
			const offers = res.data;
			this.setState({ offers });
		});
	}

	render() {
		const useStyles = makeStyles(theme => ({
			fab: {
				margin: theme.spacing(1)
			}
		}));

		return (
			<Wrapper>
				<div>
					<Fab color="primary" aria-label="Add">
						<AddIcon />
					</Fab>
					{this.state.offers.map(({ data }, index) => {
						console.log(this.state.offers);
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
					{dummyData.donationReceivers.map(({ title, imagePath, description, readMore }, index) => {
						return (
							<Card
								key={index}
								title={title}
								imagePath={imagePath}
								description={description}
								readMore={readMore}
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

import React from 'react';
import { Container } from '../../Styles';
import ContractData from '../../ContractData';
import Card from '../../Card';
import styled from 'styled-components';
import dummyData from '../../config/dummy-data';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const renderInfoAndBalancePerChild = data => {
	var name = data[0];
	var symbol = data[1];
	var balance = data[2];
	return (
		<TableRow key={symbol}>
			<TableCell key="1">{name}</TableCell>
			<TableCell key="2">{symbol}</TableCell>
			<TableCell key="3">{balance}</TableCell>
		</TableRow>
	);
}

const fetchChildrenInfo = data => {
	return <Paper>
		<Typography variant="h5" component="h3">
			My Action Tokens
		</Typography>
		<Table>
			<TableHead>
				<TableRow>
					{['Name', 'Symbol', 'Balance'].map((key, index) => {
						return <TableCell key={index}>{key}</TableCell>;
					})}
				</TableRow>
			</TableHead>
			<TableBody>
				{data.map((address, index) => {
					return (
						<ContractData key={index}
							contractAddress={address}
							method="getInfoAndBalance"
							callback={renderInfoAndBalancePerChild}
						/>)
				})}
			</TableBody>
		</Table>
	</Paper>
};

class More extends React.Component {
	render() {
		return (
			<Wrapper>
				<div>
					{dummyData.spendingOffers.map((s, i) => {
						return (
							<Card
								key={i}
								title={s.title}
								imagePath={s.imagePath}
								description={s.description}
								readMore={s.readMore}
								actionButtonText="redeem now"
							/>
						);
					})}
				</div>
				<Container>
					<ContractData
						contractName="Fin4Main"
						method="getChildren"
						callback={fetchChildrenInfo}
					/>
				</Container>
				<div>
					{dummyData.donationReceivers.map((d, i) => {
						return (
							<Card
								key={i}
								title={d.title}
								imagePath={d.imagePath}
								description={d.description}
								readMore={d.readMore}
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
	justify-content: space-around;
	align-items: center;
`;

export default More;

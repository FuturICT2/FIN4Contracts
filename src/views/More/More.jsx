import React from 'react';
import { Fin4Container, Fin4Card } from '../../Elements';
import ContractData from '../../ContractData';
import styled from 'styled-components';
import dummyData from '../../config/dummy-data';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const showRow = ({ 0: name, 1: symbol, 2: balance }) => {
	return (
		<TableRow key={symbol}>
			<TableCell key="1">{name}</TableCell>
			<TableCell key="2">{symbol}</TableCell>
			<TableCell key="3">{balance}</TableCell>
		</TableRow>
	);
};

const showBalanceByActionType = data => {
	return (
		<Paper>
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
					{data &&
						data.map((address, index) => {
							return (
								<ContractData key={index} contractAddress={address} method="getInfoAndBalance" callback={showRow} />
							);
						})}
				</TableBody>
			</Table>
		</Paper>
	);
};

class More extends React.Component {
	render() {
		return (
			<Wrapper>
				<div>
					{dummyData.spendingOffers.map(({ title, imagePath, description, readMore }, index) => {
						return (
							<Fin4Card
								key={index}
								title={title}
								imagePath={imagePath}
								description={description}
								readMore={readMore}
								actionButtonText="redeem now"
							/>
						);
					})}
				</div>
				<Fin4Container>
					<ContractData contractName="Fin4Main" method="getChildren" callback={showBalanceByActionType} />
				</Fin4Container>
				<div>
					{dummyData.donationReceivers.map(({ title, imagePath, description, readMore }, index) => {
						return (
							<Fin4Card
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
	justify-content: space-around;
	align-items: center;
`;

export default More;

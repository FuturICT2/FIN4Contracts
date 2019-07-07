import React from 'react';
import Container from '../../components/Container';
import Card from '../../components/Card';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import ContractData from '../../components/ContractData';
import styled from 'styled-components';
import dummyData from '../../config/dummy-data';

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
	render() {
		return (
			<Wrapper>
				<div>
					{dummyData.spendingOffers.map(({ title, imagePath, description, readMore }, index) => {
						return (
							<Card
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

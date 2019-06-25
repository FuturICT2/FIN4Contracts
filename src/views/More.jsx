import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import Container from '../Styles';
import ContractRetriever from '../ContractRetriever';
import Card from '../Card';
import styled from 'styled-components';
import dummyData from '../config/dummy-data';

class More extends React.Component {
	render() {
		return (
			<Wrapper>
				<div>
					{dummyData.spendingOffers.map((s, i) => {
						return <Card
							key={i}
							title={s.title}
							imagePath={s.imagePath}
							description={s.description}
							readMore={s.readMore}
							actionButtonText="redeem now"
						/>
					})}
				</div>
				<Container>
					<LoadingContainer>
						<ContractRetriever title="My Action Tokens" />
					</LoadingContainer>
				</Container>
				<div>
					{dummyData.donationReceivers.map((d, i) => {
						return <Card
							key={i}
							title={d.title}
							imagePath={d.imagePath}
							description={d.description}
							readMore={d.readMore}
							actionButtonText="donate"
						/>
					})}
				</div>
			</Wrapper>
		)
	}
}

const Wrapper = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
`

export default More;

import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import Container from '../Styles';
import ContractRetriever from '../ContractRetriever';
import styled from 'styled-components';

import DonorCard from '../DonorCard';
// import { LoadingContainer } from 'drizzle-react-components';
// import ContractData from '../ContractData';

const donationReceivers = [
	{
		title: "WWF",
		imagePath: "http://tous-logos.com/wp-content/uploads/2017/03/WWF-logo-400x333.png",
		description: "The leading organization in wildlife conservation and endangered species.",
		readMore: "https://www.wwf.ch/de"
	},
	{
		title: "Unicef",
		imagePath: "https://www.psi.org/wp-content/uploads/2014/10/UNICEF-150x150.jpeg",
		description: "UNICEF works across 190 countries and territories to reach the most disadvantaged children and adolescents.",
		readMore: "https://www.unicef.ch/en"
	}
];

const spendingOffers = [
	{
		title: "Free Tire Repair",
		imagePath: "https://cdn.pixabay.com/photo/2016/04/06/22/08/girl-1312964_960_720.png",
		description: "We are glad to offer this special service once per year.",
		readMore: "https://hackathon.trustsquare.ch/"
	},
	{
		title: "Trip To the Bouldering Park",
		imagePath: "https://images.unsplash.com/photo-1522163182402-834f871fd851",
		description: "Adventure, Sports, Fitness - you earned it.",
		readMore: "https://hackathon.trustsquare.ch/"
	}
];

class More extends React.Component {
	render() {
		return (
			<Wrapper>
				<div>
					{spendingOffers.map((s, i) => {
						return <DonorCard
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
					{donationReceivers.map((d, i) => {
						return <DonorCard
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

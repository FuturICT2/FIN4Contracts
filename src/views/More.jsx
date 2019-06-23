import React from 'react';
import { LoadingContainer } from 'drizzle-react-components';
import Container from '../Styles';
import ContractRetriever from '../ContractRetriever';

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

class More extends React.Component {
	render() {
		return (
			<>
				<Container>
				<LoadingContainer>
					<ContractRetriever/>
				</LoadingContainer>
				</Container>
				<div>
					{donationReceivers.map(d => {
						return <DonorCard
							title={d.title}
							imagePath={d.imagePath}
							description={d.description}
							readMore={d.readMore}
						/>
					})}
				</div>
			</>
		)
	}
}

export default More;

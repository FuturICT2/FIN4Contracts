import React from 'react';
import Container from '../../components/Container';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import PreviousClaims from './PreviousClaims';
import { drizzleConnect } from 'drizzle-react';
import { Fin4MainAddress } from '../../config/DeployedAddresses';
import { useTranslation } from 'react-i18next';

function Claim(props) {
	const { t, i18n } = useTranslation();
	return (
		<Container>
			<div>
				<Box title={t('claim-tokens')}>
					<ContractForm
						contractAddress={Fin4MainAddress}
						contractName="Fin4Main"
						method="submitClaim"
						labels={[t('token-type'), t('quantity'), t('date'), t('comment')]}
						singleSelectOptions={props.fin4Tokens}
					/>
				</Box>
			</div>
			<PreviousClaims />
		</Container>
	);
}

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(Claim, mapStateToProps);

import React, { Component } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { Fin4MainAddress } from '../../config/DeployedAddresses';
import { useTranslation } from 'react-i18next';

function TokenCreation(props) {
	const { t, i18n } = useTranslation();
	return (
		<Box title={t('claim-tokens')}>
			<ContractForm
				contractAddress={Fin4MainAddress}
				contractName="Fin4Main"
				method="submitClaim"
				labels={[t('token-type'), t('quantity'), t('date'), t('comment')]}
				singleSelectOptions={props.fin4Tokens}
			/>
		</Box>
	);
}

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenCreation, mapStateToProps);

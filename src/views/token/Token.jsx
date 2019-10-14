import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import TokenOverview from './TokenOverview';
import TokenCreation from './create/TokenCreation';

function Token(props) {
	const { t } = useTranslation();
	return (
		<Container>
			<TokenCreation />
			<TokenOverview />
		</Container>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(Token, mapStateToProps);

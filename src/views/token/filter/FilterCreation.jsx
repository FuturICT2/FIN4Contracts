import React from 'react';
import Box from '../../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../../components/Container';

function FilterCreation(props) {
	const { t } = useTranslation();

	return (
		<Container>
			<Box title="Create a new filter">TODO</Box>
		</Container>
	);
}

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(FilterCreation, mapStateToProps);

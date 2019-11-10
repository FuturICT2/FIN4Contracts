import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import TokenOverview from './TokenOverview';
import Box from '../../components/Box';
import { buildIconLabelLink } from '../../components/utils';
import AddIcon from '@material-ui/icons/AddBox';

function Token(props) {
	const { t } = useTranslation();
	return (
		<Container>
			<Box title={t('create-new-token')}>
				{buildIconLabelLink('/token/create', <AddIcon />, 'Start a new token creation')}
			</Box>
			<TokenOverview />
		</Container>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(Token, mapStateToProps);

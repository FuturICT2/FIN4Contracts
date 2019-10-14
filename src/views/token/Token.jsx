import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import TokenOverview from './TokenOverview';
import Box from '../../components/Box';
import Button from '../../components/Button';
import AddIcon from '@material-ui/icons/Add'; // <AddIcon/>
import { Link } from 'react-router-dom';

function Token(props) {
	const { t } = useTranslation();
	return (
		<Container>
			<Box title="Options">
				<center>
					<Link to={'/token/create/'}>
						<Button icon={AddIcon}>New Token</Button>
					</Link>
				</center>
			</Box>
			<TokenOverview />
		</Container>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(Token, mapStateToProps);

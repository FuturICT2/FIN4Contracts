import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import TokenOverview from './TokenOverview';
import Box from '../../components/Box';
import Button from '../../components/Button';
import history from '../../components/history';
import AddIcon from '@material-ui/icons/Add'; // <AddIcon/>

function Token(props) {
	const { t, i18n } = useTranslation();
	return (
		<Container>
			<Box title="Create">
				<center>
					<Button
						icon={AddIcon}
						onClick={() => {
							history.push('/token/create/');
						}}>
						New Token
					</Button>
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

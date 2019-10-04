import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';

function Token(props) {
	const { t, i18n } = useTranslation();
	return <Container>token site</Container>;
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(Token, mapStateToProps);

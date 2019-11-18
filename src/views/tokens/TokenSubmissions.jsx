import React, { useState, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import { findTokenBySymbol } from '../../components/Contractor';

function TokenSubmissions(props) {
	const { t } = useTranslation();

	const [token, setToken] = useState();

	useEffect(() => {
		let symbol = props.match.params.tokenSymbol;
		if (!token && symbol && Object.keys(props.fin4Tokens).length > 0) {
			let token = findTokenBySymbol(props, symbol);
			if (token) {
				setToken(token);
			}
		}
	});

	const getSubmissionsOnToken = () => {
		console.log(props.submissions);
		if (!token) {
			return [];
		}
		return Object.keys(props.submissions)
			.map(subId => props.submissions[subId])
			.filter(sub => sub.token === token.address);
	};

	return (
		<>
			{getSubmissionsOnToken().map(sub => {
				// TODO
				return sub.content;
			})}
		</>
	);
}

const mapStateToProps = state => {
	return {
		submissions: state.fin4Store.submissions,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenSubmissions, mapStateToProps);

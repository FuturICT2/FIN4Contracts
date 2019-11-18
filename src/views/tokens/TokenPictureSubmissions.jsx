import React, { useState, useEffect } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import { findTokenBySymbol } from '../../components/Contractor';
import moment from 'moment';

function TokenPictureSubmissions(props) {
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
		if (!token) {
			return [];
		}
		return Object.keys(props.submissions)
			.map(subId => props.submissions[subId])
			.filter(sub => sub.token === token.address);
	};

	return (
		<div style={{ fontFamily: 'arial', padding: '0 50px 0 50px' }}>
			{getSubmissionsOnToken().map((sub, idx) => {
				let date = moment.unix(sub.timestamp).calendar();
				return (
					<span key={'content_' + idx}>
						<span
							title={'By ' + sub.user + ', ' + date} // TODO add more fields here?
						>
							{sub.content}
						</span>
						&nbsp;&nbsp;
					</span>
				);
			})}
		</div>
	);
}

const mapStateToProps = state => {
	return {
		submissions: state.fin4Store.submissions,
		fin4Tokens: state.fin4Store.fin4Tokens
	};
};

export default drizzleConnect(TokenPictureSubmissions, mapStateToProps);

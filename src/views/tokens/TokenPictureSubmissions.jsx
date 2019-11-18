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
				let imgURL = 'https://gateway.ipfs.io/ipfs/' + sub.content;
				// TODO use a collage tool to make this properly?
				return (
					<span key={'content_' + idx}>
						<a href={imgURL} target="_blank">
							<img
								src={imgURL}
								style={{
									maxWidth: '300px',
									maxHeight: '200px',
									borderRadius: '20px',
									// boxShadow values copied from www.w3schools.com/css/css3_shadows.asp
									boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
								}}
								title={'By ' + sub.user + ', ' + date}></img>
						</a>
						&nbsp;&nbsp;&nbsp;&nbsp;
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

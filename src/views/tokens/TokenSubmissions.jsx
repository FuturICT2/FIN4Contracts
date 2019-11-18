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

	/*const getRandomColor = () => { // from stackoverflow.com/a/1484514/2474159
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i ++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };*/

	const getRandomFin4Color = () => {
		// first 4 taken from the Finance 4.0 logo, last 2 are main and dark from colors-config.json
		let colors = ['#00a3f0', '#6a5fad', '#cd1d70', '#3d363e', '#84aede', '#242e5e'];
		return colors[Math.floor(Math.random() * colors.length)];
	};

	const getRandomFontSize = () => {
		// from stackoverflow.com/a/45791988/2474159
		let min = 15;
		let maxAddToMin = 20;
		return Math.floor(Math.random() * maxAddToMin + min) + 'px';
	};

	return (
		<div style={{ fontFamily: 'arial', padding: '0 50px 0 50px' }}>
			{getSubmissionsOnToken().map(sub => {
				return (
					<>
						<span style={{ color: getRandomFin4Color(), fontSize: getRandomFontSize() }}>{sub.content}</span>
						&nbsp;&nbsp;
					</>
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

export default drizzleConnect(TokenSubmissions, mapStateToProps);

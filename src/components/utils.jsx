import React from 'react';
import { Link } from 'react-router-dom';
const nanoid = require('nanoid');

const buildIconLabelLink = (link, icon, label) => {
	return (
		<Link to={link} style={{ textDecoration: 'none' }}>
			<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', fontFamily: 'arial' }}>
				{icon}
				&nbsp;&nbsp;{label}
			</div>
			<br />
		</Link>
	);
};

const buildIconLabelCallback = (callback, icon, label) => {
	return (
		<>
			<Link to="#" onClick={callback} style={{ textDecoration: 'none' }}>
				<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', fontFamily: 'arial' }}>
					{icon}
					&nbsp;&nbsp;{label}
				</div>
				<br />
			</Link>
		</>
	);
};

const getFormattedSelectOptions = tokens => {
	return Object.keys(tokens).map(addr => {
		let token = tokens[addr];
		return {
			value: token.address,
			label: token.name,
			symbol: token.symbol
		};
	});
};

const getRandomTokenCreationDraftID = () => {
	// let allCookies = Cookies.get();
	// let nextIndex = Object.keys(allCookies).filter(key => key.startsWith('TokenCreationDraft')).length;
	return 'TokenCreationDraft_' + nanoid(5);
};

export { buildIconLabelLink, buildIconLabelCallback, getFormattedSelectOptions, getRandomTokenCreationDraftID };

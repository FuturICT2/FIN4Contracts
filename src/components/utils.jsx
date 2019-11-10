import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

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
			<div
				onClick={callback}
				style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', fontFamily: 'arial', color: 'blue' }}>
				{icon}
				&nbsp;&nbsp;{label}
			</div>
			<br />
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

const getNextTokenCreationDraftIndexInCookies = () => {
	let allCookies = Cookies.get();
	let nextIndex = Object.keys(allCookies).filter(key => key.startsWith('TokenCreationDraft')).length;
	return nextIndex;
};

export {
	buildIconLabelLink,
	buildIconLabelCallback,
	getFormattedSelectOptions,
	getNextTokenCreationDraftIndexInCookies
};

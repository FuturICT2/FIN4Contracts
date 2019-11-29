import React from 'react';
import { Link } from 'react-router-dom';
const nanoid = require('nanoid');

const TCRactive = false; // the other necessary switch is in migrations/3_deploy_tcr.js

const buildIconLabelLink = (link, icon, label, enabled = true, newLineAfterwards = true) => {
	let style = { textDecoration: 'none' };
	let tooltip = null;
	if (!enabled) {
		style = { textDecoration: 'none', color: 'silver' };
		tooltip = 'Available soon';
	}
	return (
		<Link to={enabled ? link : '#'} style={style} title={tooltip}>
			<div style={{ display: 'flex', alignItems: 'center', paddingLeft: '15px', fontFamily: 'arial' }}>
				{icon}
				&nbsp;&nbsp;{label}
			</div>
			{newLineAfterwards && <br />}
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
	return nanoid(5);
};

const findProofTypeAddressByName = (proofTypes, name) => {
	for (var addr in proofTypes) {
		if (proofTypes.hasOwnProperty(addr)) {
			if (proofTypes[addr].label === name) {
				return addr;
			}
		}
	}
	return null;
};

export {
	buildIconLabelLink,
	buildIconLabelCallback,
	getFormattedSelectOptions,
	getRandomTokenCreationDraftID,
	findProofTypeAddressByName,
	TCRactive
};

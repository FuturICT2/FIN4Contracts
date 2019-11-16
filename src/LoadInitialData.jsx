import React, { useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import {
	addSatelliteContracts,
	addTCRcontracts,
	fetchMessages,
	fetchAllTokens,
	fetchUsersNonzeroTokenBalances,
	fetchCurrentUsersClaims,
	fetchAndAddAllProofTypes,
	fetchCollectionsInfo,
	fetchOPATs,
	fetchSystemParameters,
	fetchUsersGOVbalance,
	fetchUsersREPbalance,
	fetchParameterizerParams
} from './components/Contractor';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import { TCRactive } from './components/utils';

function LoadInitialData(props, context) {
	const isInit = useRef({
		// "once" flags
		Fin4Main: false,
		Fin4TokenManagement: false,
		Fin4Messaging: false,
		Fin4Claiming: false,
		Fin4Collections: false,
		Fin4Proofing: false,
		Registry: false,
		Parameterizer: false,
		Fin4SystemParameters: false,
		REP: false,
		GOV: false,
		tokenCreationDraftsLoaded: false // from cookies to store
	});

	useEffect(() => {
		if (!props.drizzleInitialized) {
			return; // we don't move a muscle until that is done
		}

		if (!isInit.current.Fin4Main && props.contracts.Fin4Main.initialized) {
			isInit.current.Fin4Main = true;
			// can happen in parallel once Fin4Main is ready:
			addSatelliteContracts(props, context.drizzle.contracts.Fin4Main, context.drizzle);
			if (TCRactive) {
				addTCRcontracts(props, context.drizzle.contracts.Fin4Main, context.drizzle);
			}
		}

		if (!isInit.current.Registry && props.contracts.Registry && props.contracts.Registry.initialized) {
			isInit.current.Registry = true;
		}

		if (
			TCRactive &&
			!isInit.current.Parameterizer &&
			props.contracts.Parameterizer &&
			props.contracts.Parameterizer.initialized
		) {
			isInit.current.Parameterizer = true;
			fetchParameterizerParams(props, context.drizzle.contracts.Parameterizer);
		}

		if (!isInit.current.GOV && props.contracts.GOV && props.contracts.GOV.initialized) {
			isInit.current.GOV = true;
			fetchUsersGOVbalance(props, context.drizzle.contracts.GOV);
		}

		if (!isInit.current.REP && props.contracts.Fin4Reputation && props.contracts.Fin4Reputation.initialized) {
			isInit.current.REP = true;
			fetchUsersREPbalance(props, context.drizzle.contracts.Fin4Reputation);
		}

		if (
			!isInit.current.Fin4SystemParameters &&
			props.contracts.Fin4SystemParameters &&
			props.contracts.Fin4SystemParameters.initialized
		) {
			isInit.current.Fin4SystemParameters = true;
			fetchSystemParameters(props, context.drizzle.contracts.Fin4SystemParameters);
		}

		if (
			!isInit.current.Fin4TokenManagement &&
			props.contracts.Fin4TokenManagement &&
			props.contracts.Fin4TokenManagement.initialized &&
			isInit.current.Registry
		) {
			isInit.current.Fin4TokenManagement = true;
			let Fin4TokenManagementContract = context.drizzle.contracts.Fin4TokenManagement;
			fetchAllTokens(props, Fin4TokenManagementContract, () => {
				if (TCRactive) {
					fetchOPATs(props, context.drizzle.contracts.Registry);
				}
				fetchUsersNonzeroTokenBalances(props, Fin4TokenManagementContract);
			});
		}

		if (!isInit.current.Fin4Messaging && props.contracts.Fin4Messaging && props.contracts.Fin4Messaging.initialized) {
			isInit.current.Fin4Messaging = true;
			fetchMessages(props, context.drizzle.contracts.Fin4Messaging);
		}

		if (
			!isInit.current.Fin4Collections &&
			props.contracts.Fin4Collections &&
			props.contracts.Fin4Collections.initialized
		) {
			isInit.current.Fin4Collections = true;
			fetchCollectionsInfo(props, context.drizzle.contracts.Fin4Collections);
		}

		if (!isInit.current.Fin4Claiming && props.contracts.Fin4Claiming && props.contracts.Fin4Claiming.initialized) {
			isInit.current.Fin4Claiming = true;
			fetchCurrentUsersClaims(props, context.drizzle.contracts.Fin4Claiming);
		}

		if (!isInit.current.Fin4Proofing && props.contracts.Fin4Proofing && props.contracts.Fin4Proofing.initialized) {
			isInit.current.Fin4Proofing = true;
			fetchAndAddAllProofTypes(props, context.drizzle.contracts.Fin4Proofing, context.drizzle);
		}

		if (!isInit.current.tokenCreationDraftsLoaded) {
			isInit.current.tokenCreationDraftsLoaded = true;
			loadTokenCreationDraftsFromCookieToStore();
		}
	});

	const loadTokenCreationDraftsFromCookieToStore = () => {
		let allCookies = Cookies.get();
		Object.keys(allCookies)
			.filter(key => key.startsWith('TokenCreationDraft'))
			.map(key => {
				props.dispatch({
					type: 'ADD_TOKEN_CREATION_DRAFT',
					draft: JSON.parse(allCookies[key]),
					addToCookies: false
				});
			});
	};

	return null;
}

LoadInitialData.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		drizzleInitialized: state.fin4Store.drizzleInitialized
	};
};

export default drizzleConnect(LoadInitialData, mapStateToProps);

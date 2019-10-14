import React, { useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import {
	addSatelliteContracts,
	fetchMessages,
	fetchAllTokens,
	fetchUsersNonzeroTokenBalances,
	fetchCurrentUsersClaims,
	fetchAndAddAllProofTypes,
	fetchCollectionsInfo
} from './components/Contractor';
import PropTypes from 'prop-types';

function LoadInitialData(props, context) {
	const isInit = useRef({
		// "once" flags
		Fin4Main: false,
		Fin4TokenManagement: false,
		Fin4Messages: false,
		Fin4Claiming: false,
		Fin4Collections: false,
		tokensFetched: false
	});

	useEffect(() => {
		if (!props.drizzleInitialized) {
			return; // we don't move a muscle until that is done
		}

		if (!isInit.current.Fin4Main && props.contracts.Fin4Main.initialized) {
			isInit.current.Fin4Main = true;
			let Fin4MainContract = context.drizzle.contracts.Fin4Main;
			// can happen in parallel once Fin4Main is ready:
			addSatelliteContracts(props, Fin4MainContract, context.drizzle); // = Fin4Messages, Fin4Claiming and Fin4Collections
			fetchAndAddAllProofTypes(props, Fin4MainContract, context.drizzle);
		}

		if (
			!isInit.current.Fin4TokenManagement &&
			props.contracts.Fin4TokenManagement &&
			props.contracts.Fin4TokenManagement.initialized
		) {
			isInit.current.Fin4TokenManagement = true;
			let Fin4TokenManagementContract = context.drizzle.contracts.Fin4TokenManagement;
			fetchAllTokens(props, Fin4TokenManagementContract, () => {
				isInit.current.tokensFetched = true;
				fetchUsersNonzeroTokenBalances(props, Fin4TokenManagementContract);
			});
		}

		if (!isInit.current.Fin4Messages && props.contracts.Fin4Messages && props.contracts.Fin4Messages.initialized) {
			isInit.current.Fin4Messages = true;
			fetchMessages(props, context.drizzle.contracts.Fin4Messages);
		}

		if (
			!isInit.current.Fin4Collections &&
			props.contracts.Fin4Collections &&
			props.contracts.Fin4Collections.initialized
		) {
			isInit.current.Fin4Collections = true;
			fetchCollectionsInfo(props, context.drizzle.contracts.Fin4Collections);
		}

		if (
			!isInit.current.Fin4Claiming &&
			props.contracts.Fin4Claiming &&
			props.contracts.Fin4Claiming.initialized &&
			isInit.current.tokensFetched
		) {
			isInit.current.Fin4Claiming = true;
			fetchCurrentUsersClaims(props, context.drizzle.contracts.Fin4Claiming);
		}
	});

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

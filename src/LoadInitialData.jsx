import React, { useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import {
	addSatelliteContracts,
	fetchMessages,
	fetchAllTokens,
	fetchUsersNonzeroTokenBalances,
	fetchCurrentUsersClaims,
	fetchAndAddAllProofTypes
} from './components/Contractor';
import PropTypes from 'prop-types';

function LoadInitialData(props, context) {
	const isInit = useRef({
		// "once" flags
		Fin4Main: false,
		Fin4Messages: false,
		Fin4Claiming: false
	});

	useEffect(() => {
		if (!props.drizzleInitialized) {
			return; // we don't move a muscle until that is done
		}

		if (!isInit.current.Fin4Main && props.contracts.Fin4Main.initialized) {
			isInit.current.Fin4Main = true;
			let Fin4MainContract = context.drizzle.contracts.Fin4Main;
			// can happen in parallel once Fin4Main is ready:
			addSatelliteContracts(props, Fin4MainContract, context.drizzle); // = Fin4Messages and Fin4Claiming
			fetchAllTokens(props, Fin4MainContract);
			fetchUsersNonzeroTokenBalances(props, Fin4MainContract);
			fetchAndAddAllProofTypes(props, Fin4MainContract, context.drizzle);
		}

		if (!isInit.current.Fin4Messages && props.contracts.Fin4Messages && props.contracts.Fin4Messages.initialized) {
			isInit.current.Fin4Messages = true;
			fetchMessages(props, context.drizzle.contracts.Fin4Messages);

			// TODO message stubs
		}

		if (!isInit.current.Fin4Claiming && props.contracts.Fin4Claiming && props.contracts.Fin4Claiming.initialized) {
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

import React, { useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { addSatelliteContracts, fetchMessages } from './components/Contractor';
import PropTypes from 'prop-types';

function LoadInitialData(props, context) {
	const isInit = useRef({
		// "once" flags
		Fin4Main: false,
		Fin4Messages: false
	});

	useEffect(() => {
		if (!props.drizzleInitialized) {
			return; // we don't move a muscle until that is done
		}

		if (!isInit.current.Fin4Main && props.contracts.Fin4Main.initialized) {
			isInit.current.Fin4Main = true;
			addSatelliteContracts(props, context.drizzle); // = Fin4Messages and Fin4Claiming
		}

		if (!isInit.current.Fin4Messages && props.contracts.Fin4Messages && props.contracts.Fin4Messages.initialized) {
			isInit.current.Fin4Messages = true;
			fetchMessages(props, context.drizzle.contracts.Fin4Messages);
		}

		// TODO
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

import React, { useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { addSatelliteContracts } from './components/Contractor';
import PropTypes from 'prop-types';

function LoadInitialData(props, context) {
	const isInit = useRef({
		// "once" flags
		Fin4Main: false
	});

	useEffect(() => {
		if (!props.drizzleInitialized) {
			return; // we don't move a muscle until that is done
		}

		if (!isInit.current.Fin4Main && props.contracts.Fin4Main.initialized) {
			isInit.current.Fin4Main = true;
			addSatelliteContracts(props, context.drizzle); // = Fin4Messages and Fin4Claiming
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

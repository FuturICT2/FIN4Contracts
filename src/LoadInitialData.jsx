import React, { useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { loadInitialDataIntoStore } from './components/Contractor';
import PropTypes from 'prop-types';

function LoadInitialData(props, context) {
	const onceFlags = useRef({
		drizzleInit: false
	});

	useEffect(() => {
		if (!onceFlags.current.drizzleInit && props.drizzleInitialized) {
			onceFlags.current.drizzleInit = true;
			loadInitialDataIntoStore(props, context.drizzle);
		}
	});

	return null;
}

LoadInitialData.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		drizzleInitialized: state.fin4Store.drizzleInitialized
	};
};

export default drizzleConnect(LoadInitialData, mapStateToProps);

import { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { loadInitialDataIntoStore } from './components/Contractor';
import PropTypes from 'prop-types';

class LoadInitialData extends Component {
	constructor(props, context) {
		super(props);
		this.drizzle = context.drizzle;
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.drizzleInitialized !== nextProps.drizzleInitialized) {
			loadInitialDataIntoStore(nextProps, this.drizzle);
		}
	}

	render() {
		return null;
	}
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

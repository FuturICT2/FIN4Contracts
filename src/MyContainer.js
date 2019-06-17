import MyComponent from './MyComponent';
import { drizzleConnect } from 'drizzle-react';

const mapStateToProps = state => {
	return {
		accounts: state.accounts,
		Fin4BaseToken: state.contracts.Fin4BaseToken,
		ProofDummy: state.contracts.ProofDummy,
		drizzleStatus: state.drizzleStatus
	};
};

const Container = drizzleConnect(MyComponent, mapStateToProps);

export default Container;

import React from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import { Divider } from '@material-ui/core';

function ProofTypes(props, context) {
	const { t } = useTranslation();

	return (
		<Container>
			<Box title="Proof types">
				<div style={{ fontFamily: 'arial' }}>
					{Object.keys(props.proofTypes).map((addr, index) => {
						let proofType = props.proofTypes[addr];
						let name = proofType.label;
						let address = proofType.value;
						// TODO used in x tokens...
						return (
							<span key={'proof_' + index}>
								<b>{name}</b>
								<br />
								<a
									style={{ fontSize: 'x-small' }}
									href={'https://rinkeby.etherscan.io/address/' + address}
									target="_blank">
									{address}
								</a>
								<br />
								{proofType.description}
								<br />
								{proofType.paramsEncoded && (
									<small style={{ color: 'gray' }}>
										<b>Parameters</b>: {proofType.paramsEncoded}
									</small>
								)}
								{index < Object.keys(props.proofTypes).length - 1 && (
									<Divider style={{ margin: '10px 0' }} variant="middle" />
								)}
							</span>
						);
					})}
				</div>
			</Box>
		</Container>
	);
}

ProofTypes.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(ProofTypes, mapStateToProps);

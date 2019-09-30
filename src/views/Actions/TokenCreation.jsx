import React, { useState } from 'react';
import ContractForm from '../../components/ContractForm';
import Box from '../../components/Box';
import Modal from '../../components/Modal';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import Currency from '../../components/Currency';
import { Fin4MainAddress } from '../../config/DeployedAddresses.js';
import { useTranslation } from 'react-i18next';

function TokenCreation(props) {
	const { t, i18n } = useTranslation();

	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<>
			<Box title={t('create-new-token')}>
				<ContractForm
					contractAddress={Fin4MainAddress}
					contractName="Fin4Main"
					method="createNewToken"
					multiSelectOptions={Object.keys(props.proofTypes).map(addr => props.proofTypes[addr])}
					labels={[t('token-name'), t('token-symbol'), t('description'), t('unit-of-measurement'), t('proof-types')]}
					hideArgs={{
						paramValues: 'paramValues',
						paramValuesIndices: 'paramValuesIndices'
					}}
					helperModalTriggers={[null, null, null, null, toggleModal]}
				/>
			</Box>
			<Modal isOpen={isModalOpen} handleClose={toggleModal} title="Proof Types">
				<Table headers={[t('proof-name'), t('description')]}>
					<>
						{Object.keys(props.proofTypes).map((addr, index) => {
							let proofType = props.proofTypes[addr];
							return (
								<TableRow
									key={'proof_' + index}
									data={{
										name: proofType.label,
										description: proofType.description
									}}
								/>
							);
						})}
					</>
				</Table>
			</Modal>
			{Object.keys(props.fin4Tokens).length > 0 && (
				<Box title={t('tokens-you-created')}>
					<Table headers={[t('token-name')]}>
						{Object.keys(props.fin4Tokens).map((addr, index) => {
							let token = props.fin4Tokens[addr];
							return (
								<TableRow
									key={'token_' + index}
									data={{
										name: <Currency symbol={token.symbol} name={token.name} />
										// edit: 'TODO'
									}}
								/>
							);
						})}
					</Table>
				</Box>
			)}
		</>
	);
}

TokenCreation.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		contracts: state.contracts,
		fin4Tokens: state.fin4Store.fin4Tokens,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenCreation, mapStateToProps);

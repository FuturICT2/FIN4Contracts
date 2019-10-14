import React, { useState } from 'react';
import ContractForm from '../../../components/ContractForm';
import Box from '../../../components/Box';
import Modal from '../../../components/Modal';
import Table from '../../../components/Table';
import TableRow from '../../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import { Fin4MainAddress } from '../../../config/DeployedAddresses.js';
import { useTranslation } from 'react-i18next';

function TokenCreation(props) {
	const { t } = useTranslation();

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
		</>
	);
}

const mapStateToProps = state => {
	return {
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenCreation, mapStateToProps);

import React from 'react';
import Modal from '../../components/Modal';
import { drizzleConnect } from 'drizzle-react';
import ContractForm from '../../components/ContractForm';
import { useTranslation } from 'react-i18next';

function RevealModal(props) {
	const { t } = useTranslation();

	return (
		<center>
			<Modal isOpen={props.isOpen} handleClose={props.handleClose} title="Set vote and salt" width="400px">
				<ContractForm
					contractName="PLCRVoting"
					method="revealVote"
					labels={['_pollID', 'Vote', 'Salt']}
					staticArgs={{
						_pollID: props.pollID
					}}
					postSubmitCallback={(success, result) => {
						if (!success) {
							alert(result.message);
						}
						props.handleClose();
					}}
				/>
			</Modal>
		</center>
	);
}

export default drizzleConnect(RevealModal);

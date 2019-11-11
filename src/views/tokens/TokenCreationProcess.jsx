import React, { useEffect, useState, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import Box from '../../components/Box';
import StepBasics from './creationProcess/StepBasics';

function TokenCreation(props, context) {
	const { t } = useTranslation();

	const [draft, setDraft] = useState(null);

	useEffect(() => {
		let draftId = props.match.params.draftId;
		if (draft || !draftId || !props.tokenCreationDrafts[draftId]) {
			return;
		}
		setDraft(props.tokenCreationDrafts[draftId]);
	});

	return (
		<>
			{draft ? (
				<Container>
					<Box title="Token creation">
						<StepBasics draft={draft} onSubmit={() => {}} />
					</Box>
				</Container>
			) : (
				<center style={{ fontFamily: 'arial' }}>
					No token creation draft found with ID {props.match.params.draftId}
				</center>
			)}
		</>
	);
}

const mapStateToProps = state => {
	return {
		tokenCreationDrafts: state.fin4Store.tokenCreationDrafts,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenCreation, mapStateToProps);

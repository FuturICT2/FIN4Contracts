import React, { useEffect, useState } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';

function TokenCreation(props, context) {
	const { t } = useTranslation();

	const [draft, setDraft] = useState(null);

	useEffect(() => {
		if (draft) {
			return;
		}
		let draftId = props.match.params.draftId;
		// TODO
	});

	return (
		<Container>
			<Box title="Token creation: step 1"></Box>
		</Container>
	);
}

const mapStateToProps = state => {
	return {
		tokenCreationDrafts: state.fin4Store.tokenCreationDrafts,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenCreation, mapStateToProps);

import React, { useEffect, useState, useRef } from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import { TextField } from '@material-ui/core';
import Button from '../../components/Button';

function TokenCreation(props, context) {
	const { t } = useTranslation();

	const [draftId, setDraftId] = useState(null);

	const fields = useRef({
		name: '',
		symbol: '',
		description: ''
	});

	useEffect(() => {
		let draftIdViaURL = props.match.params.draftId;
		if (draftId || !draftIdViaURL || Object.keys(props.tokenCreationDrafts).length === 0) {
			return;
		}
		let draft = props.tokenCreationDrafts[draftIdViaURL];
		fields.current = {
			name: draft.name && draft.name.length > 0 ? draft.name : '',
			symbol: draft.symbol && draft.symbol.length > 0 ? draft.symbol : '',
			description: draft.description && draft.description.length > 0 ? draft.description : ''
		};
		setDraftId(draftIdViaURL);
	});

	const submit = () => {
		props.dispatch({
			type: 'UPDATE_TOKEN_CREATION_DRAFT_FIELDS',
			draftId: draftId,
			fields: fields.current
		});
	};

	return (
		<Container>
			<Box title="Token creation: step 1">
				{draftId && (
					<>
						<TextField
							key="name-field"
							type="text"
							label="Name"
							defaultValue={fields.current.name}
							onChange={e => (fields.current.name = e.target.value)}
							style={inputFieldStyle}
						/>
						<TextField
							key="symbol-field"
							type="text"
							label="Symbol"
							defaultValue={fields.current.symbol}
							onChange={e => (fields.current.symbol = e.target.value)}
							style={inputFieldStyle}
						/>
						<TextField
							key="description-field"
							type="text"
							label="Description"
							defaultValue={fields.current.description}
							onChange={e => (fields.current.description = e.target.value)}
							style={inputFieldStyle}
						/>
						<div style={{ float: 'right', padding: '10px 10px 10px 0' }}>
							<Button onClick={submit}>Next step</Button>
						</div>
					</>
				)}
			</Box>
		</Container>
	);
}

const inputFieldStyle = {
	width: '100%',
	marginBottom: '15px'
};

const mapStateToProps = state => {
	return {
		tokenCreationDrafts: state.fin4Store.tokenCreationDrafts,
		proofTypes: state.fin4Store.proofTypes
	};
};

export default drizzleConnect(TokenCreation, mapStateToProps);

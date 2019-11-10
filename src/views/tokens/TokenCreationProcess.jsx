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

	const values = useRef({
		name: '',
		symbol: '',
		description: ''
	});

	useEffect(() => {
		if (draftId) {
			return;
		}
		let draftIdViaURL = props.match.params.draftId;
		if (draftIdViaURL && Object.keys(props.tokenCreationDrafts).length > 0) {
			let draftObj = props.tokenCreationDrafts['TokenCreationDraft_' + draftIdViaURL];
			values.current = {
				name: draftObj.name && draftObj.name.length > 0 ? draftObj.name : '',
				symbol: draftObj.symbol && draftObj.symbol.length > 0 ? draftObj.symbol : '',
				description: draftObj.description && draftObj.description.length > 0 ? draftObj.description : ''
			};
			setDraftId('TokenCreationDraft_' + draftIdViaURL);
		}
	});

	const submit = () => {
		props.dispatch({
			type: 'UPDATE_TOKEN_CREATION_DRAFT_FIELDS',
			draftId: draftId,
			fields: values.current
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
							defaultValue={values.current.name}
							onChange={e => (values.current.name = e.target.value)}
							style={inputFieldStyle}
						/>
						<TextField
							key="symbol-field"
							type="text"
							label="Symbol"
							defaultValue={values.current.symbol}
							onChange={e => (values.current.symbol = e.target.value)}
							style={inputFieldStyle}
						/>
						<TextField
							key="description-field"
							type="text"
							label="Description"
							defaultValue={values.current.description}
							onChange={e => (values.current.description = e.target.value)}
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

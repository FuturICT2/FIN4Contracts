import React, { useState, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import TokenOverview from './TokenOverview';
import Box from '../../components/Box';
import { buildIconLabelLink, buildIconLabelCallback, getFormattedSelectOptions } from '../../components/utils';
import AddIcon from '@material-ui/icons/AddBox';
import ImportIcon from '@material-ui/icons/ImportExport';
import CopyIcon from '@material-ui/icons/FileCopy';
import moment from 'moment';
import Dropdown from '../../components/Dropdown';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import SyntaxHighlighter from 'react-syntax-highlighter';
const fileDownload = require('js-file-download');
const slugify = require('slugify');

function Token(props) {
	const { t } = useTranslation();

	/* {
		"name": "Test Token",
		"symbol": "TTO",
		"created": "1573390378626",
		"lastModified": "1573390378626"
	} */
	const [uploadFileVisible, setUploadFileVisible] = useState(false);
	const toggleUploadFileVisible = () => {
		setUploadFileVisible(!uploadFileVisible);
	};

	const onSelectFile = file => {
		toggleUploadFileVisible();
		let reader = new window.FileReader();
		reader.readAsText(file);
		reader.onloadend = () => {
			let importedDraft = JSON.parse(reader.result);
			// TODO sanity checks before adding?
			props.dispatch({
				type: 'ADD_TOKEN_CREATION_DRAFT',
				draft: importedDraft
			});
		};
	};

	const [tokenChooserVisible, setTokenChooserVisible] = useState(false);
	const toggleTokenChooserVisible = () => {
		setTokenChooserVisible(!tokenChooserVisible);
	};
	const chosenTokenAddress = useRef(null);

	const importTokenAsDraft = () => {
		toggleTokenChooserVisible();
		if (chosenTokenAddress.current === null || !props.fin4Tokens[chosenTokenAddress.current]) {
			alert('Invalid or no token selected');
			return;
		}
		let templateToken = props.fin4Tokens[chosenTokenAddress.current];
		let nowTimestamp = moment().valueOf();
		props.dispatch({
			type: 'ADD_TOKEN_CREATION_DRAFT',
			draft: {
				name: 'Copy of ' + templateToken.name,
				symbol: (templateToken.symbol.length < 5 ? templateToken.symbol : templateToken.symbol.substring(0, 4)) + '2',
				created: nowTimestamp,
				lastModified: nowTimestamp
			}
		});
	};

	const exportDraft = index => {
		let draft = props.tokenCreationDrafts[index];
		let name = 'TokenCreationDraft_';
		if (draft.name.length > 0) {
			name += slugify(draft.name);
		} else if (draft.symbol.length > 0) {
			name += slugify(draft.symbol);
		} else {
			name += index; // or now-timestamp as fallback?
		}
		fileDownload(JSON.stringify(draft, null, 4), name + '.json');
	};

	const [isPreviewDraftModalOpen, setPreviewDraftModalOpen] = useState(false);
	const togglePreviewDraftModalOpen = () => {
		setPreviewDraftModalOpen(!isPreviewDraftModalOpen);
	};
	const previewDraftStr = useRef('');

	const previewDraft = index => {
		let draft = props.tokenCreationDrafts[index];
		previewDraftStr.current = JSON.stringify(draft, null, 2);
		togglePreviewDraftModalOpen();
	};

	return (
		<Container>
			<Box title={t('create-new-token')}>
				{buildIconLabelLink('/token/create', <AddIcon />, 'Start a new token creation')}
				{buildIconLabelCallback(toggleUploadFileVisible, <ImportIcon />, 'Import token creation draft')}
				{uploadFileVisible && (
					<>
						<input
							style={{ paddingLeft: '45px' }}
							type="file"
							onChange={e => onSelectFile(e.target.files[0])}
							accept="application/json"
						/>
						<br />
						<br />
					</>
				)}
				{buildIconLabelCallback(toggleTokenChooserVisible, <CopyIcon />, 'Import existing token as draft')}
				{tokenChooserVisible && (
					<>
						{' '}
						{/*TODO something nicer more react/material-ui ish then <table>?*/}
						<table>
							<tbody>
								<tr>
									<td width="250px">
										<Dropdown
											key="token-chooser"
											onChange={e => (chosenTokenAddress.current = e.value)}
											options={getFormattedSelectOptions(props.fin4Tokens)}
											label={t('token-type')}
										/>
									</td>
									<td>
										<Button style={{ paddingLeft: '20px' }} onClick={importTokenAsDraft}>
											Import
										</Button>
									</td>
								</tr>
							</tbody>
						</table>
						<br />
					</>
				)}
				{props.tokenCreationDrafts.length > 0 && (
					<>
						<br />
						<div style={{ fontFamily: 'arial' }}>
							<b>Your token creation drafts:</b>
							<ul>
								{props.tokenCreationDrafts.map((draft, index) => {
									let date = moment.unix(Number(draft.lastModified) / 1000).calendar();
									return (
										<li key={'draft_' + index} style={{ paddingBottom: '10px' }}>
											<span onClick={() => previewDraft(index)} title="Click to see draft as JSON object">
												{draft.name.length > 0 ? draft.name : <i>no-name-yet</i>}
											</span>
											<small style={{ color: 'gray' }}>
												{' last modified: '}
												{date}
											</small>
											<br />
											<small style={{ color: 'green' }}>
												<span>Continue editing</span>
												<span style={{ color: 'silver' }}> | </span>
												<span onClick={() => exportDraft(index)}>Export</span>
												<span style={{ color: 'silver' }}> | </span>
												<span>Delete</span>
											</small>
											<br />
										</li>
									);
								})}
							</ul>
						</div>
					</>
				)}
				<Modal
					isOpen={isPreviewDraftModalOpen}
					handleClose={togglePreviewDraftModalOpen}
					title="Token creation draft"
					width="400px">
					<SyntaxHighlighter language="json">{previewDraftStr.current}</SyntaxHighlighter>
				</Modal>
			</Box>
			<TokenOverview />
		</Container>
	);
}

const mapStateToProps = state => {
	return {
		fin4Tokens: state.fin4Store.fin4Tokens,
		tokenCreationDrafts: state.fin4Store.tokenCreationDrafts
	};
};

export default drizzleConnect(Token, mapStateToProps);

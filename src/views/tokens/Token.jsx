import React, { useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import TokenOverview from './TokenOverview';
import Box from '../../components/Box';
import { buildIconLabelLink, buildIconLabelCallback } from '../../components/utils';
import AddIcon from '@material-ui/icons/AddBox';
import ImportIcon from '@material-ui/icons/ImportExport';
import moment from 'moment';

function Token(props) {
	const { t } = useTranslation();

	const [tokenDrafts, setTokenDrafts] = useState([]);

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
			// TODO sanity checks before adding to tokenDrafts?
			setTokenDrafts(tokenDrafts.concat(importedDraft));
		};
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
					</>
				)}
				{tokenDrafts.length > 0 && (
					<>
						<br />
						<div style={{ fontFamily: 'arial' }}>
							<b>Your token creation drafts</b>
							<ul>
								{tokenDrafts.map((draft, index) => {
									let date = moment.unix(Number(draft.lastModified) / 1000).calendar();
									return (
										<li key={'draft_' + index} style={{ paddingBottom: '10px' }}>
											{draft.name.length > 0 ? draft.name : <i>no-name-yet</i>}
											<small style={{ color: 'gray' }}>
												{' last modified: '}
												{date}
											</small>
											<br />
											<small style={{ color: 'green' }}>
												<span>Continue editing</span>
												<span style={{ color: 'silver' }}> | </span>
												<span>Export</span>
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
			</Box>
			<TokenOverview />
		</Container>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(Token, mapStateToProps);

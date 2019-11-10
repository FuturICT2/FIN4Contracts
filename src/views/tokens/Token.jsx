import React, { useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import TokenOverview from './TokenOverview';
import Box from '../../components/Box';
import { buildIconLabelLink, buildIconLabelCallback } from '../../components/utils';
import AddIcon from '@material-ui/icons/AddBox';
import ImportIcon from '@material-ui/icons/ImportExport';

function Token(props) {
	const { t } = useTranslation();

	const [tokenDrafts, setTokenDrafts] = useState([]);

	const [uploadFileVisible, setUploadFileVisible] = useState(false);
	const toggleUploadFileVisible = () => {
		setUploadFileVisible(!uploadFileVisible);
	};

	const onSelectFile = file => {
		toggleUploadFileVisible();
		// TODO
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
			</Box>
			<TokenOverview />
		</Container>
	);
}

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(Token, mapStateToProps);

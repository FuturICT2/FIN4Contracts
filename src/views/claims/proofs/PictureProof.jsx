import React from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import PictureUploadComponent from './PictureUploadComponent';

function PictureProof(props, context) {
	const { t } = useTranslation();

	const onSubmit = (approverAddress, ipfsHash) => {
		context.drizzle.contracts.Picture.methods
			.submitProof_Picture(props.tokenAddr, props.claimId, approverAddress, ipfsHash)
			.send({ from: props.store.getState().fin4Store.defaultAccount })
			.then(result => {
				console.log('Results of submitting: ', result);
			});
	};

	return <PictureUploadComponent onSubmit={onSubmit} />;
}

PictureProof.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(PictureProof);

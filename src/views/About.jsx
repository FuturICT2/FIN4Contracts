import React from 'react';
import Box from '../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	font: {
		'font-family': 'arial'
	}
}));

function About(props, context) {
	const { t } = useTranslation();

	const classes = useStyles();
	return (
		<Container>
			<Box title="About"></Box>
		</Container>
	);
}

About.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(About);

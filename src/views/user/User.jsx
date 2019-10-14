import React from 'react';
import Box from '../../components/Box';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Container from '../../components/Container';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

function User(props, context) {
	const { t } = useTranslation();

	return (
		<Container>
			<Box title="User actions">
				<center>
					<Link to={'/user/message'}>
						<Button>Message user</Button>
					</Link>
					<br />
					<br />
					<Link to={'/user/transfer'}>
						<Button>Transfer tokens to user</Button>
					</Link>
				</center>
			</Box>
		</Container>
	);
}

User.contextTypes = {
	drizzle: PropTypes.object
};

export default drizzleConnect(User);

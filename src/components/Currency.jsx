import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const Symbol = styled.span`
	text-transform: uppercase;
	border: 1px solid silver;
	border-radius: 4px;
	padding: 3px 3px 1px 3px;
	color: gray;
`;

const useStyles = makeStyles(theme => ({
	unstyledLink: {
		'text-decoration': 'none'
	}
}));

const Currency = props => {
	const classes = useStyles();

	const symbol = () => {
		return props.symbol ? <Symbol>{props.symbol}</Symbol> : '';
	};

	const nameWithoutLink = () => {
		return <span style={{ marginLeft: props.symbol ? 5 : 0 }}>{props.name}</span>;
	};

	const nameWithLink = () => {
		return (
			<span style={{ marginLeft: 5 }}>
				<Link className={classes.unstyledLink} to={props.linkTo}>
					{props.name}
				</Link>
			</span>
		);
	};

	if (props.name) {
		if (props.linkTo) {
			return (
				<>
					{symbol()}
					{nameWithLink()}
				</>
			);
		} else {
			return (
				<>
					{symbol()}
					{nameWithoutLink()}
				</>
			);
		}
	} else {
		return symbol();
	}
};

export default Currency;

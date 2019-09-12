import React from 'react';
import { Fab } from '@material-ui/core';
import styled from 'styled-components';

const Button = props => {
	const ActualButton = (
		<StyledButton
			key="submit"
			variant="extended"
			size="small"
			color={props.color || 'primary'}
			onClick={props.onClick}
			{...props}>
			{props.icon && <props.icon style={{ marginRight: 7 }} />}
			{props.children}
		</StyledButton>
	);
	return props.center ? <p style={{ textAlign: 'center' }}>{ActualButton}</p> : ActualButton;
};

const StyledButton = styled(Fab)`
	height: 32px !important;
	padding-left: ${props => (props.icon ? '13px' : '20px')} !important;
	padding-right: 20px !important;
`;

export default Button;

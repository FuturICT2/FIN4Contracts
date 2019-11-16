import React from 'react';
import { TableCell, TableRow } from '@material-ui/core';

const Fin4TableRow = props => {
	const keys = Object.keys(props.data);
	const values = Object.values(props.data);
	return (
		<TableRow>
			{keys.map((key, index) => {
				return (
					<TableCell style={props.tdStyle} key={key}>
						{values[index]}
					</TableCell>
				);
			})}
		</TableRow>
	);
};

export default Fin4TableRow;

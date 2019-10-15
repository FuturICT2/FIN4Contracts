import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const Fin4Table = props => {
	const size = props.size || 'medium';
	return (
		<Table size={size}>
			<TableHead>
				<TableRow>
					{props.headers.map((key, index) => {
						return (
							<TableCell width={(props.colWidths ? props.colWidths[index] : '100') + '%'} key={index}>
								{key}
							</TableCell>
						);
					})}
				</TableRow>
			</TableHead>
			<TableBody>{props.children}</TableBody>
		</Table>
	);
};

export default Fin4Table;

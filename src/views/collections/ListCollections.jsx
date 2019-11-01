import React from 'react';
import Box from '../../components/Box';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function ListCollections(props) {
	const { t } = useTranslation();

	return (
		<Box title="Token collections">
			<Table headers={['Name', 'Actions']} colWidths={[85, 15]}>
				{Object.keys(props.collections).map((identifier, index) => {
					let collection = props.collections[identifier];
					return (
						<TableRow
							key={'collection_' + index}
							data={{
								name: (
									<span
										title={
											'Short-name: ' +
											identifier +
											'\nDescription: ' +
											collection.description +
											'\nTokens: ' +
											collection.tokens.length
										}>
										{collection.name}
									</span>
								),
								actions: (
									<small style={{ color: 'blue', textDecoration: 'underline' }}>
										<Link to={'/collection/' + identifier}>View</Link>
										{(collection.userIsCreator || collection.userIsAdmin) && (
											<>
												<br />
												<Link to={'/collection/edit/' + identifier}>Edit</Link>
											</>
										)}
									</small>
								)
							}}
						/>
					);
				})}
			</Table>
		</Box>
	);
}

ListCollections.contextTypes = {
	drizzle: PropTypes.object
};

const mapStateToProps = state => {
	return {
		collections: state.fin4Store.collections
	};
};

export default drizzleConnect(ListCollections, mapStateToProps);

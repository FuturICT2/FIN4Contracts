import React, { useState, useEffect } from 'react';
import Table from './Table';
import TableRow from './TableRow';
import { drizzleConnect } from 'drizzle-react';
import Currency from './Currency';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

function SortableTokenList(props, context) {
	const { t } = useTranslation();

	const [tokens, setTokens] = useState([]);

	const [filterIconHovered, setFilterIconHovered] = useState(false);
	const [sortIconHovered, setSortIconHovered] = useState(false);
	const [filterSettingsOpen, setFilterSettingsOpen] = useState(false);
	const [sortSettingsOpen, setSortSettingsOpen] = useState(false);
	const toggleFilterSettings = () => {
		setFilterSettingsOpen(!setFilterSettingsOpen);
	};
	const toggleSortSettings = () => {
		setSortSettingsOpen(!sortSettingsOpen);
	};

	useEffect(() => {
		if (tokens.length != props.tokens.length) {
			setTokens(props.tokens);
		}
	});

	return (
		<>
			<TableIcons>
				<FontAwesomeIcon
					icon={faFilter}
					style={filterIconHovered ? styles.iconsHovered : styles.iconsDefault}
					onClick={toggleFilterSettings}
					onMouseEnter={() => setFilterIconHovered(true)}
					onMouseLeave={() => setFilterIconHovered(false)}
				/>
				<FontAwesomeIcon
					icon={faSortAmountDownAlt}
					style={sortIconHovered ? styles.iconsHovered : styles.iconsDefault}
					onClick={toggleSortSettings}
					onMouseEnter={() => setSortIconHovered(true)}
					onMouseLeave={() => setSortIconHovered(false)}
				/>
			</TableIcons>
			<Table headers={[t('token-name'), 'Supply', 'Actions']} colWidths={[65, 20, 15]}>
				{tokens.map((token, index) => {
					return (
						<TableRow
							key={'token_' + index}
							data={{
								name: (
									<span title={'Description: ' + token.description + '\nUnit: ' + token.unit}>
										<Currency symbol={token.symbol} name={token.name} />
									</span>
								),
								totalSupply: token.totalSupply,
								actions: (
									<small style={{ color: 'blue', textDecoration: 'underline' }}>
										<Link to={'/token/view/' + token.symbol}>View</Link>
										<br />
										{(token.userIsCreator || token.userIsAdmin) && (
											<>
												<Link to={'/token/edit/' + token.symbol}>Edit</Link>
												<br />
											</>
										)}
										<Link to={'/claim/' + token.symbol}>Claim</Link>
									</small>
								)
							}}
						/>
					);
				})}
			</Table>
		</>
	);
}

const TableIcons = styled.div`
	text-align: right;
	padding-right: 20px;
`;

const styles = {
	// TODO make a shared default and use multiple classes in the FontAwesomeIcon?
	iconsDefault: {
		color: 'gray',
		width: '14px',
		height: '14px',
		paddingLeft: '10px' // padding: top right bottom left
	},
	iconsHovered: {
		color: 'silver',
		width: '14px',
		height: '14px',
		paddingLeft: '10px'
	}
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(SortableTokenList, mapStateToProps);

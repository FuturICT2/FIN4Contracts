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
import OutlinedDiv from './OutlinedDiv';
import { Checkbox, FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

function SortableTokenList(props, context) {
	const { t } = useTranslation();

	const [tokens, setTokens] = useState([]);

	const [filterIconHovered, setFilterIconHovered] = useState(false);
	const [sortIconHovered, setSortIconHovered] = useState(false);
	const [filterSettingsOpen, setFilterSettingsOpen] = useState(false);
	const [sortSettingsOpen, setSortSettingsOpen] = useState(false);
	const [sortingMode, setSortingMode] = useState('by-name');
	const [sortingModeReversed, setSortingModeReversed] = useState(false);
	const toggleFilterSettings = () => {
		if (!filterSettingsOpen && sortSettingsOpen) {
			toggleSortSettings();
		}
		setFilterSettingsOpen(!filterSettingsOpen);
	};
	const toggleSortSettings = () => {
		if (!sortSettingsOpen && filterSettingsOpen) {
			toggleFilterSettings();
		}
		setSortSettingsOpen(!sortSettingsOpen);
	};

	const [filterModes, setFilterModes] = useState({
		'user-is-creator': true,
		'user-is-admin': true,
		'claimed-by-user': true
	});

	useEffect(() => {
		if (tokens.length != props.tokens.length) {
			setTokens(props.tokens);
		}
	});

	const buildPlusMinusCheckbox = (attribute, label) => {
		return (
			<FormControlLabel
				control={
					<Checkbox
						icon={<RemoveIcon />}
						checkedIcon={<AddIcon />}
						checked={filterModes[attribute]}
						onChange={() => {
							setFilterModes({
								...filterModes,
								[attribute]: !filterModes[attribute]
							});
						}}
					/>
				}
				label={label}
			/>
		);
	};

	return (
		<>
			<TableIcons>
				<FontAwesomeIcon
					icon={faFilter}
					style={filterIconHovered ? styles.iconHovered : filterSettingsOpen ? styles.iconActive : styles.iconDefault}
					onClick={toggleFilterSettings}
					onMouseEnter={() => setFilterIconHovered(true)}
					onMouseLeave={() => setFilterIconHovered(false)}
				/>
				<FontAwesomeIcon
					icon={faSortAmountDownAlt}
					style={sortIconHovered ? styles.iconHovered : sortSettingsOpen ? styles.iconActive : styles.iconDefault}
					onClick={toggleSortSettings}
					onMouseEnter={() => setSortIconHovered(true)}
					onMouseLeave={() => setSortIconHovered(false)}
				/>
			</TableIcons>
			{filterSettingsOpen && (
				<OutlinedDiv label="Filter options">
					{buildPlusMinusCheckbox('user-is-creator', 'You are creator')}
					{buildPlusMinusCheckbox('user-is-admin', 'You are admin')}
					{buildPlusMinusCheckbox('claimed-by-user', 'You claimed it')}
					<br />
					<TextField type="text" label="Name contains" onChange={e => {}} />
					<br />
					{/* TODO
						+- in front of name contains
						has these proof types: multiselect dropdown
						total supply <> x 
						# of claims <> x

						Reset option
					*/}
				</OutlinedDiv>
			)}
			{sortSettingsOpen && (
				<OutlinedDiv label="Sort by...">
					<RadioGroup row={true} onChange={e => setSortingMode(e.target.value)} value={sortingMode}>
						<FormControlLabel value="by-name" control={<Radio />} label="Name" />
						<FormControlLabel value="by-symbol" control={<Radio />} label="Symbol" />
						<FormControlLabel value="by-date" control={<Radio />} label="Creation date" />
						<FormControlLabel value="by-supply" control={<Radio />} label="Total supply" />
						<FormControlLabel value="by-claims" control={<Radio />} label="Claims" />
					</RadioGroup>
					<div style={{ textAlign: 'right' }}>
						<FormControlLabel
							control={<Checkbox onChange={() => setSortingModeReversed(!sortingModeReversed)} />}
							label="Reverse"
						/>
					</div>
				</OutlinedDiv>
			)}
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
	iconDefault: {
		color: 'gray',
		width: '14px',
		height: '14px',
		paddingLeft: '10px' // padding: top right bottom left
	},
	iconHovered: {
		color: 'silver',
		width: '14px',
		height: '14px',
		paddingLeft: '10px'
	},
	iconActive: {
		color: 'blue',
		width: '14px',
		height: '14px',
		paddingLeft: '10px'
	}
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(SortableTokenList, mapStateToProps);

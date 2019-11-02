import React, { useState } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faEquals,
	faNotEqual,
	faGreaterThan,
	faLessThan,
	faGreaterThanEqual,
	faLessThanEqual
} from '@fortawesome/free-solid-svg-icons';

const modes = [faEquals, faNotEqual, faGreaterThan, faLessThan, faGreaterThanEqual, faLessThanEqual];

function ComparisonSigns(props) {
	const [modeIdx, setModeIdx] = useState(0);
	const [hovered, setHovered] = useState(false);

	const nextMode = () => {
		let nextModeIdx = modeIdx === modes.length - 1 ? 0 : modeIdx + 1;
		setModeIdx(nextModeIdx);
		props.setComparisonMode([nextModeIdx].iconName);
	};

	return (
		<>
			<FontAwesomeIcon
				icon={modes[modeIdx]}
				style={hovered ? styles.hovered : styles.default}
				onClick={nextMode}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
			/>
		</>
	);
}

const styles = {
	default: {
		color: 'black',
		width: '12px',
		height: '12px'
	},
	hovered: {
		color: 'gray',
		width: '12px',
		height: '12px'
	}
};

export default drizzleConnect(ComparisonSigns);

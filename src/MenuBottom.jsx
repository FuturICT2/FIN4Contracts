import React from 'react';
import colors from './colors-config';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AccountIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/AddCircle';
import ListIcon from '@material-ui/icons/ViewList';

const useStyles = makeStyles({
	root: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0,
		background: colors.main
	},
	element: {
		color: colors.main2
	}
});

const MenuBottom = function() {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	return (
		<BottomNavigation
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
			}}
			showLabels
			className={classes.root}>
			<BottomNavigationAction
				label="Me"
				icon={<AccountIcon />}
				className={classes.element}
			/>
			<BottomNavigationAction
				label="Submit Claim"
				icon={<AddIcon />}
				className={classes.element}
			/>
			<BottomNavigationAction
				label="History"
				icon={<ListIcon />}
				className={classes.element}
			/>
		</BottomNavigation>
	);
};

export default MenuBottom;

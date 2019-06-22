import React from 'react';
import { Link } from 'react-router-dom';
import colors from './config/colors-config';
import menuItems from './config/menu-config';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

const useStyles = makeStyles({
	root: {
		background: colors.main,
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0
	},
	element: {
		color: colors.main2,
		maxWidth: 'none',
		width: '100%'
	}
});

const NavigationBar = function () {
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
			{menuItems.map((route, i) => {
				return (
					<BottomNavigationAction
						key={i}
						component={Link}
						to={route.path}
						label={route.label}
						icon={<route.icon />}
						className={classes.element}
					/>
				);
			})}
		</BottomNavigation>
	);
};

export default NavigationBar;

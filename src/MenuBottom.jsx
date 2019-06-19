import React from 'react';
import { Link, Route, BrowserRouter as Router } from 'react-router-dom';
import colors from './config/colors-config';
import menu from './config/menu-config';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';

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
		<Router>
			<BottomNavigation
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
				showLabels
				className={classes.root}>
				{menu.map((route, i) => {
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

			{/* register menu routes */}
			{menu.map((route, i) => (
				<Route key={i} render={() => <route.component />} path={route.path} />
			))}
		</Router>
	);
};

export default MenuBottom;

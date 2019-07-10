import Home from '@material-ui/icons/DirectionsRun';
import StarIcon from '@material-ui/icons/StarRate';

import Actions from '../views/Actions/Actions';
import More from '../views/More/More';

const menu = [
	{
		component: Actions,
		path: '/',
		label: 'Actions',
		icon: Home
	},
	{
		component: More,
		path: '/more',
		label: 'More',
		icon: StarIcon
	}
];

export default menu;

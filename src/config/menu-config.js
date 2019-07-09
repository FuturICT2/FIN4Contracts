import Home from '@material-ui/icons/DirectionsRun';
import StarIcon from '@material-ui/icons/StarRate';

import More from '../views/More/More';
import Actions from '../views/Actions/Actions';
import Approving from '../views/Approving';
import Offers from '../views/More/OfferCreation';

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
	},
	{
		component: Approving,
		path: '/approving',
		label: 'Approving',
		icon: StarIcon
	},
	{
		component: Offers,
		path: '/offers',
		label: 'Offers',
		icon: StarIcon
	}
];

export default menu;

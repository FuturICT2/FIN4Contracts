import HomeIcon from '@material-ui/icons/DirectionsRun';
import StarIcon from '@material-ui/icons/Star';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';

import Actions from '../views/Actions/Actions';
import More from '../views/More/More';
import AcceptedTokens from '../views/AcceptedTokens/AcceptedTokens';

const menu = [
	{
		component: Actions,
		path: '/',
		label: 'Actions',
		icon: HomeIcon
	},
	{
		component: More,
		path: '/more',
		label: 'More',
		icon: StarIcon
	},
	{
		component: AcceptedTokens,
		path: '/AcceptedTokens',
		label: 'Accepted Tokens',
		icon: CheckIcon
	}
];

export default menu;

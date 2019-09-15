/*
import HomeIcon from '@material-ui/icons/DirectionsRun';
import StarIcon from '@material-ui/icons/Star';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import More from '../views/More/More';
import AcceptedTokens from '../views/AcceptedTokens/AcceptedTokens';
*/
import Actions from '../views/Actions/Actions';
import Create from '../views/Actions/Create';
import AddIcon from '@material-ui/icons/AddBox';
import DoneIcon from '@material-ui/icons/Done';

const menu = [
	{
		component: Actions,
		path: '/',
		label: 'Claim',
		icon: DoneIcon
	},
	{
		component: Create,
		path: '/create',
		label: 'Create',
		icon: AddIcon
	}
	/*{
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
	}*/
];

export default menu;

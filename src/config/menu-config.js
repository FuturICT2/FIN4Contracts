//import ActionsIcon from '@material-ui/icons/DirectionsRun';
//import StarIcon from '@material-ui/icons/Star';
//import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import AddIcon from '@material-ui/icons/AddBox';
import DoneIcon from '@material-ui/icons/Done';
import HomeIcon from '@material-ui/icons/Home';
import Home from '../views/Home';
import Actions from '../views/Actions/Actions';
import Create from '../views/Actions/Create';

const menu = [
	{
		component: Home,
		path: '/',
		label: 'Home',
		icon: HomeIcon,
		showInNavBar: true
	},
	{
		component: Actions,
		path: '/claim',
		label: 'Claim',
		icon: DoneIcon,
		showInNavBar: true
	},
	{
		component: Create,
		path: '/create',
		label: 'Create',
		icon: AddIcon,
		showInNavBar: true
	}
	/*{
		component: More,
		path: '/more',
		label: 'More',
		icon: StarIcon,
		showInNavBar: false
	},
	{
		component: AcceptedTokens,
		path: '/AcceptedTokens',
		label: 'Accepted Tokens',
		icon: CheckIcon,
		showInNavBar: false
	}*/
];

export default menu;

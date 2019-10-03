//import ActionsIcon from '@material-ui/icons/DirectionsRun';
//import StarIcon from '@material-ui/icons/Star';
//import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import AddIcon from '@material-ui/icons/AddBox';
import DoneIcon from '@material-ui/icons/Done';
import HomeIcon from '@material-ui/icons/Home';
import Home from '../views/Home/Home';
import Claim from '../views/Actions/Claim';
import Create from '../views/Actions/Create';

const menu = [
	{
		component: Home,
		path: '/',
		label: 'Home',
		icon: HomeIcon,
		showInNavBar: true,
		exact: true
	},
	{
		component: Claim,
		path: '/claim',
		label: 'Claim',
		icon: DoneIcon,
		showInNavBar: true,
		exact: false
	},
	{
		component: Create,
		path: '/create',
		label: 'Create',
		icon: AddIcon,
		showInNavBar: true,
		exact: false
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

// import ActionsIcon from '@material-ui/icons/DirectionsRun';
// import DoneIcon from '@material-ui/icons/Done';
import StarIcon from '@material-ui/icons/Star';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import AddIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import Home from '../views/Home/Home';
import Claim from '../views/Actions/Claim';
import TokenView from '../views/Actions/TokenView';
import Token from '../views/Actions/Token';
import TokenCreation from '../views/Actions/TokenCreation';

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
		component: Token,
		path: '/token/',
		label: 'Tokens',
		icon: StarIcon,
		showInNavBar: true,
		exact: true
	},
	{
		component: Claim,
		path: '/token/claim',
		label: 'Claim',
		icon: CheckIcon,
		showInNavBar: true,
		exact: false
	},
	{
		component: TokenCreation,
		path: '/token/create',
		label: 'Create',
		icon: AddIcon,
		showInNavBar: false,
		exact: true
	},
	{
		component: TokenView,
		path: '/token/view/:tokenSymbol',
		showInNavBar: false,
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

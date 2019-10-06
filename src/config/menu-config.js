// import ActionsIcon from '@material-ui/icons/DirectionsRun';
// import DoneIcon from '@material-ui/icons/Done';
import StarIcon from '@material-ui/icons/Star';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import AddIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import Home from '../views/Home/Home';
import Claim from '../views/token/claim/Claim';
import TokenView from '../views/token/view/TokenView';
import Token from '../views/token/Token';
import TokenCreation from '../views/token/create/TokenCreation';

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
		path: '/token/claim/:tokenSymbol',
		showInNavBar: false,
		exact: false
	},
	{
		component: Claim,
		path: '/token/claim',
		label: 'Claim',
		icon: CheckIcon,
		showInNavBar: true,
		exact: true
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
	},
	{
		component: TokenView,
		path: '/token/view/',
		showInNavBar: false,
		exact: true
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

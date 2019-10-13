// import ActionsIcon from '@material-ui/icons/DirectionsRun';
// import DoneIcon from '@material-ui/icons/Done';
import StarIcon from '@material-ui/icons/Star';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';
import AddIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import UserIcon from '@material-ui/icons/Person';
import Home from '../views/Home/Home';
import Claim from '../views/token/claim/Claim';
import TokenDetails from '../views/token/view/TokenDetails';
import Token from '../views/token/Token';
import TokenCreation from '../views/token/create/TokenCreation';
import ProofSubmission from '../views/token/claim/proof/ProofSubmission';
import FilterCreation from '../views/token/filter/FilterCreation';
import UserMessage from '../views/user/UserMessage';
import UserTransfer from '../views/user/UserTransfer';
import User from '../views/user/User';
import Settings from '../views/Settings';

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
		exact: true
	},
	{
		component: ProofSubmission,
		path: '/token/claim/:tokenSymbol/proof/:claimId',
		showInNavBar: false,
		exact: true
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
		component: TokenDetails,
		path: '/token/details/:tokenSymbol',
		showInNavBar: false,
		exact: true
	},
	{
		component: TokenDetails,
		path: '/token/details/',
		showInNavBar: false,
		exact: true
	},
	{
		component: FilterCreation,
		path: '/token/filter/create/',
		showInNavBar: false,
		exact: true
	},
	{
		component: User,
		path: '/user',
		label: 'Users',
		icon: UserIcon,
		showInNavBar: true,
		exact: true
	},
	{
		component: UserMessage,
		path: '/user/message/:userAddress',
		showInNavBar: false,
		exact: true
	},
	{
		component: UserMessage,
		path: '/user/message/',
		showInNavBar: false,
		exact: true
	},
	{
		component: UserTransfer,
		path: '/user/transfer/',
		showInNavBar: false,
		exact: true
	},
	{
		component: UserTransfer,
		path: '/user/transfer/:userAddress',
		showInNavBar: false,
		exact: true
	},
	{
		component: UserTransfer,
		path: '/user/transfer/:userAddress/:tokenSymbol',
		showInNavBar: false,
		exact: true
	},
	{
		component: UserTransfer,
		path: '/user/transfer/:userAddress/:tokenSymbol/:transferAmount',
		showInNavBar: false,
		exact: true
	},
	{
		component: Settings,
		path: '/settings/',
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

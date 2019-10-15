import ListIcon from '@material-ui/icons/List';
import CheckIcon from '@material-ui/icons/CheckCircle';
import HomeIcon from '@material-ui/icons/Home';
import UsersIcon from '@material-ui/icons/Group';
import CollectionsIcon from '@material-ui/icons/CollectionsBookmark';
import Home from '../views/Home/Home';
import Claim from '../views/claims/Claim';
import TokenDetails from '../views/token/TokenDetails';
import TokenEdit from '../views/token/TokenEdit';
import Token from '../views/token/Token';
import ProofSubmission from '../views/claims/ProofSubmission';
import Collections from '../views/collection/Collections';
import CollectionView from '../views/collection/CollectionView';
import CollectionEdit from '../views/collection/CollectionEdit';
import UserMessage from '../views/user/UserMessage';
import UserTransfer from '../views/user/UserTransfer';
import User from '../views/user/User';
import Settings from '../views/Settings';
import About from '../views/About';

const menu = [
	{
		component: Home,
		path: '/',
		label: 'Home',
		icon: HomeIcon,
		showInNavBar: true // SHOW IN NAVBAR
	},
	// ------------------ TOKENS ------------------
	{
		component: Token,
		path: '/tokens',
		label: 'Tokens',
		icon: ListIcon,
		showInNavBar: true // SHOW IN NAVBAR
	},
	{
		component: TokenDetails,
		path: '/token/details/',
		showInNavBar: false
	},
	{
		component: TokenDetails,
		path: '/token/details/:tokenSymbol',
		showInNavBar: false
	},
	{
		component: TokenEdit,
		path: '/token/edit/:tokenSymbol',
		showInNavBar: false
	},
	// ------------------ CLAIMS ------------------
	{
		component: Claim,
		path: '/claims',
		label: 'Claims',
		icon: CheckIcon,
		showInNavBar: true // SHOW IN NAVBAR
	},
	{
		component: Claim,
		path: '/claim/:tokenSymbol',
		showInNavBar: false
	},
	{
		component: ProofSubmission,
		path: '/claim/:tokenSymbol/proof/:claimId',
		showInNavBar: false
	},
	// ------------------ COLLECTIONS ------------------
	{
		component: Collections,
		path: '/collections/',
		label: 'Collections',
		icon: CollectionsIcon,
		showInNavBar: true // SHOW IN NAVBAR
	},
	{
		component: CollectionView,
		path: '/collection/:collectionIdentifier',
		showInNavBar: false
	},
	{
		component: CollectionEdit,
		path: '/collection/edit/:collectionIdentifier',
		showInNavBar: false
	},
	// ------------------ USERS ------------------
	{
		component: User,
		path: '/users',
		label: 'Users',
		icon: UsersIcon,
		showInNavBar: true // SHOW IN NAVBAR
	},
	{
		component: UserMessage,
		path: '/user/message',
		showInNavBar: false
	},
	{
		component: UserMessage,
		path: '/user/message/:userAddress',
		showInNavBar: false
	},
	{
		component: UserTransfer,
		path: '/user/transfer',
		showInNavBar: false
	},
	{
		component: UserTransfer,
		path: '/user/transfer/:userAddress',
		showInNavBar: false
	},
	{
		component: UserTransfer,
		path: '/user/transfer/:userAddress/:tokenSymbol',
		showInNavBar: false
	},
	{
		component: UserTransfer,
		path: '/user/transfer/:userAddress/:tokenSymbol/:transferAmount',
		showInNavBar: false
	},
	// ------------------ SETTINGS ------------------
	{
		component: Settings,
		path: '/settings',
		showInNavBar: false
	},
	// ------------------ ABOUT ------------------
	{
		component: About,
		path: '/about',
		showInNavBar: false
	}
];

export default menu;

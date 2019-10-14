// import ActionsIcon from '@material-ui/icons/DirectionsRun';
// import DoneIcon from '@material-ui/icons/Done';
//import StarIcon from '@material-ui/icons/Star';
import ListIcon from '@material-ui/icons/List';
import CheckIcon from '@material-ui/icons/CheckCircle';
import AddIcon from '@material-ui/icons/AddBox';
import HomeIcon from '@material-ui/icons/Home';
import UsersIcon from '@material-ui/icons/Group';
import CollectionsIcon from '@material-ui/icons/CollectionsBookmark';
import Home from '../views/Home/Home';
import Claim from '../views/token/claim/Claim';
import TokenDetails from '../views/token/view/TokenDetails';
import Token from '../views/token/Token';
import TokenCreation from '../views/token/create/TokenCreation';
import ProofSubmission from '../views/token/claim/proof/ProofSubmission';
import Collections from '../views/token/collection/Collections';
import CollectionView from '../views/token/collection/CollectionView';
import CollectionEdit from '../views/token/collection/CollectionEdit';
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
	// ------------------ TOKENS ------------------
	{
		component: Token,
		path: '/tokens',
		label: 'Tokens',
		icon: ListIcon,
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
		path: '/token/details/',
		showInNavBar: false,
		exact: true
	},
	{
		component: TokenDetails,
		path: '/token/details/:tokenSymbol',
		showInNavBar: false,
		exact: true
	},
	// ------------------ CLAIMS ------------------
	{
		component: Claim,
		path: '/claims',
		label: 'Claims',
		icon: CheckIcon,
		showInNavBar: true,
		exact: true
	},
	{
		component: Claim,
		path: '/claim/:tokenSymbol',
		showInNavBar: false,
		exact: true
	},
	{
		component: ProofSubmission,
		path: '/claim/:tokenSymbol/proof/:claimId',
		showInNavBar: false,
		exact: true
	},
	// ------------------ COLLECTIONS ------------------
	{
		component: Collections,
		path: '/collections/',
		label: 'Collections',
		icon: CollectionsIcon,
		showInNavBar: true,
		exact: true
	},
	{
		component: CollectionView,
		path: '/collection/:collectionIdentifier',
		showInNavBar: false,
		exact: true
	},
	{
		component: CollectionEdit,
		path: '/collection/edit/:collectionIdentifier',
		showInNavBar: false,
		exact: true
	},
	// ------------------ USERS ------------------
	{
		component: User,
		path: '/users',
		label: 'Users',
		icon: UsersIcon,
		showInNavBar: true,
		exact: true
	},
	{
		component: UserMessage,
		path: '/user/message',
		showInNavBar: false,
		exact: true
	},
	{
		component: UserMessage,
		path: '/user/message/:userAddress',
		showInNavBar: false,
		exact: true
	},
	{
		component: UserTransfer,
		path: '/user/transfer',
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
	// ------------------ SETTINGS ------------------
	{
		component: Settings,
		path: '/settings',
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

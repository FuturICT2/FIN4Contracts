import ListIcon from '@material-ui/icons/List';
import CheckIcon from '@material-ui/icons/CheckCircle';
import HomeIcon from '@material-ui/icons/Home';
import Home from '../views/Home/Home';
import Claim from '../views/claims/Claim';
import TokenView from '../views/tokens/TokenView';
import TokenEdit from '../views/tokens/TokenEdit';
import Token from '../views/tokens/Token';
import ProofSubmission from '../views/claims/ProofSubmission';
import Collections from '../views/collections/Collections';
import CollectionView from '../views/collections/CollectionView';
import CollectionEdit from '../views/collections/CollectionEdit';
import UserMessage from '../views/users/UserMessage';
import UserTransfer from '../views/users/UserTransfer';
import Settings from '../views/Settings';
import About from '../views/About';
import Groups from '../views/users/Groups';
import GroupEdit from '../views/users/GroupEdit';
import Listing from '../views/CuratedTokens/Listing';
import Management from '../views/CuratedTokens/Management';
import Governance from '../views/CuratedTokens/Governance';
import Messages from '../views/Messages';
import TokenCreationProcess from '../views/tokens/TokenCreationProcess';
import ProofTypes from '../views/proofTypes/ProofTypes';
import TokenTextSubmissions from '../views/tokens/TokenTextSubmissions';

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
		component: TokenCreationProcess,
		path: '/token/create/:draftId',
		showInNavBar: false
	},
	{
		component: TokenView,
		path: '/token/view/',
		showInNavBar: false
	},
	{
		component: TokenView,
		path: '/token/view/:tokenSymbol',
		showInNavBar: false
	},
	{
		component: TokenEdit,
		path: '/token/edit/:tokenSymbol',
		showInNavBar: false
	},
	// ------------------ SUBMISSIONS ON TOKENS ------------------
	// Submissions on proof types or per user also possible #ConceptualDecision
	{
		component: TokenTextSubmissions,
		path: '/token/submissions/:tokenSymbol/text',
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
	// ------------------ PROOF TYPES ------------------
	{
		component: ProofTypes,
		path: '/proofs/',
		showInNavBar: false
	},
	// ------------------ COLLECTIONS ------------------
	{
		component: Collections,
		path: '/collections/',
		showInNavBar: false
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
		component: Messages,
		path: '/messages',
		showInNavBar: false
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
	{
		component: Groups,
		path: '/users/groups/',
		showInNavBar: false
	},
	{
		component: GroupEdit,
		path: '/users/group/edit/:groupId',
		showInNavBar: false
	},
	// ------------------ GOVERNANCE ------------------
	{
		component: Listing,
		path: '/governance/listing',
		showInNavBar: false
	},
	{
		component: Management,
		path: '/governance/management',
		showInNavBar: false
	},
	{
		component: Governance,
		path: '/governance/parameters',
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

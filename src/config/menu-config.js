import AccountIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/AddCircle';

import Home from '../views/Account/Account';
import ClaimSubmission from '../views/ActionClaim/ClaimSubmission';
import NewToken from '../views/TokenCreation/NewToken';

const menu = [
	{ component: Home, path: '/', label: 'Me', icon: AccountIcon },
	{
		component: ClaimSubmission,
		path: '/action/claim',
		label: 'Claim Action',
		icon: AddIcon
	},
	{
		component: NewToken,
		path: '/action/create',
		label: 'Create Action Type',
		icon: AddIcon
	}
];

export default menu;

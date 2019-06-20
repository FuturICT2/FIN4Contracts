import AccountIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/AddCircle';

import Home from '../views/Home';
import ActionClaimSubmission from '../views/ActionClaimSubmission';
import NewToken from '../views/NewToken';

const menu = [
	{ component: Home, path: '/', label: 'Me', icon: AccountIcon },
	{
		component: ActionClaimSubmission,
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

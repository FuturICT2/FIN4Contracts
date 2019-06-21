import AccountIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/AddCircle';

import Home from '../views/Home';
import NewActionType from '../views/NewActionType';
import ActionClaimSubmission from '../views/ActionClaimSubmission';

const menu = [
	{ component: Home, path: '/', label: 'Me', icon: AccountIcon },
	{
		component: ActionClaimSubmission,
		path: '/action/claim',
		label: 'Claim Action',
		icon: AddIcon
	},
	{
		component: NewActionType,
		path: '/action/create',
		label: 'Create Action Type',
		icon: AddIcon
	}
];

export default menu;

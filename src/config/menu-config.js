import AccountIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/AddCircle';

import Home from '../views/Home';
import NewActionType from '../views/NewActionType';

const menu = [
	{ component: Home, path: '/', label: 'Me', icon: AccountIcon },
	{
		component: NewActionType,
		path: '/action/create',
		label: 'Create Action Type',
		icon: AddIcon
	}
];

export default menu;

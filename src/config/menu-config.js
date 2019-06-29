import Home from '@material-ui/icons/DirectionsRun';
import StarIcon from '@material-ui/icons/StarRate';

import More from '../views/More';
import ActionClaimSubmission from '../views/ActionClaimSubmission';
import ProofSubmission from '../views/ProofSubmission';

const menu = [
	{
		component: ActionClaimSubmission,
		path: '/',
		label: 'Actions',
		icon: Home
	},
	{
		component: More,
		path: '/more',
		label: 'More',
		icon: StarIcon
	},
	{
		component: ProofSubmission,
		path: '/proof',
		label: 'Proof',
		icon: StarIcon
	}
];

export default menu;

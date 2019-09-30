// adapted from https://medium.com/@olinations/10-steps-to-convert-a-react-class-component-to-a-functional-component-with-hooks-ab198e0fa139

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const en = require('./en.json');
const de = require('./de.json');

const resources = {
	en: {
		translation: en
	},
	de: {
		translation: de
	}
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		lng: 'en',

		keySeparator: false, // we do not use keys in form messages.welcome

		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

export default i18n;

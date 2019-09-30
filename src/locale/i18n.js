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

i18n.use(initReactI18next).init({
	resources,
	lng: 'en',

	keySeparator: false,

	interpolation: {
		escapeValue: false
	}
});

export default i18n;

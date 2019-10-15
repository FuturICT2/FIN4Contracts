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

// i18n have their own i18next-browser-languagedetector
// I tried it but it didn't switch languages as expected and so I am doing it manually
// for now, TODO for some point: figure out how to use their plugin properly
let defaultLanguage = 'en';
let browserLanguage = window.navigator.userLanguage || window.navigator.language;
if (browserLanguage.startsWith('de')) {
	defaultLanguage = 'de';
}
if (!(defaultLanguage == 'en' || defaultLanguage == 'de')) {
	console.error(
		'Your browsers preferred language ' + browserLanguage + ' is not supported yet. Falling back to English.'
	);
}

i18n.use(initReactI18next).init({
	resources,
	lng: defaultLanguage,
	keySeparator: false,
	interpolation: {
		escapeValue: false
	}
});

export default i18n;

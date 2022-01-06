// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import 'jest-localstorage-mock';
import '@testing-library/jest-dom/extend-expect';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './lang/en.json';

// Official workaround from Jest for the error `window.matchMedia()`
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  // debug: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: { en },
});

import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: `${process.env.REACT_APP_BACKEND_PORTAL_URL}/config/app-locales/portal/{{lng}}`,
      customHeaders: {
        authorization: `Bearer ${process.env.REACT_APP_API_AUTHORIZATION}`,
      },
    },
  });

export default i18n;

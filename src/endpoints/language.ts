import { AxiosRequestConfig } from 'axios';
import memoize from 'lodash/memoize';

import enLocal from '../lang/en.json';
import itLocal from '../lang/it.json';

memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    url: '/users/setLanguage',
  }),
);

export const optionsSaveTranslation = memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    data: { en: enLocal, it: itLocal },
    url: '/config/admin/app-resources/portal',
  }),
);

import { AxiosRequestConfig } from 'axios';
import memoize from 'lodash/memoize';

export const optionsValidateEmailUser = memoize(
  (token): AxiosRequestConfig => ({
    method: 'post' as 'post',
    url: '/users/validateEmail',
    data: { token },
  }),
);

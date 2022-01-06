import memoize from 'lodash/memoize';
import { AxiosRequestConfig } from 'axios';

export const optionsValidateEmailUser = memoize(
  (token): AxiosRequestConfig => ({
    method: 'post' as 'post',
    url: '/users/validateEmail',
    data: { token },
  }),
);

import { AxiosRequestConfig } from 'axios';
import memoize from 'lodash/memoize';

export const optionsDeleteSupplier = memoize(
  (): AxiosRequestConfig => ({
    method: 'delete',
    url: `${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers`,
  }),
);

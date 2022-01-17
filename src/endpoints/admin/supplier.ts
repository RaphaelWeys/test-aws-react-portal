import { AxiosRequestConfig } from 'axios';
import memoize from 'lodash/memoize';

export const optionsGetSuppliers = memoize(
  (): AxiosRequestConfig => ({
    method: 'get',
    url: `${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers`,
  }),
);
export const optionsDeleteSupplier = memoize(
  (): AxiosRequestConfig => ({
    method: 'delete',
    url: `${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers`,
  }),
);
export const optionsCreateSupplier = memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    url: `${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers`,
  }),
);
export const optionsUpdateSupplier = memoize(
  (id): AxiosRequestConfig => ({
    method: 'put',
    url: `${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers/${id}`,
  }),
);

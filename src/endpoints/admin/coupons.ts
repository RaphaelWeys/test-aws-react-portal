import { AxiosRequestConfig } from 'axios';
import memoize from 'lodash/memoize';

export const optionsGetCoupons = memoize(
  (): AxiosRequestConfig => ({
    method: 'get',
    url: '/coupon/admin/list',
  }),
);

export const optionsCreateCoupon = memoize((): AxiosRequestConfig => ({ url: '/coupon/admin/create', method: 'post' }));

export const optionsUpdateCoupon = memoize((): AxiosRequestConfig => ({ url: '/coupon/admin/create', method: 'put' }));

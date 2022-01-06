import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Coupon } from '../../../interface/coupon';

interface TValues {
  code: string;
  app: string | null;
  purpose: string;
  value: number;
  user: string | null;
  multipleUsage: boolean;
  validityStart: string | null;
  validityEnd: string | null;
}

interface TContext {
  currentCoupons: Coupon[];
}

export const useUpdateCoupon = (couponId = '') => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Coupon, AxiosError<Coupon>, TValues, TContext>(
    (data) => client.put(`/coupon/admin/update/${couponId}`, data).then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('get-coupons');
      },
      onError() {
        message.error('Cannot update the coupon');
      },
    },
  );
};

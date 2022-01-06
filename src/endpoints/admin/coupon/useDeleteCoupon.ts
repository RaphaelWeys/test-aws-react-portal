import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Coupon } from '../../../interface/coupon';

type TContext = { coupons: Coupon[] };

export const useDeleteCoupon = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Coupon, AxiosError<Coupon>, string, TContext>(
    (couponId) => client.delete(`/coupon/admin/delete/${couponId}`).then((res) => res.data),
    {
      onMutate(couponId) {
        const coupons = queryClient.getQueryData('get-coupons') as Coupon[];
        const newCoupons = coupons.filter((coupon) => coupon.id !== couponId);

        queryClient.setQueryData('get-coupons', newCoupons);
        return { coupons };
      },
      onError(error, _, context) {
        if (context) queryClient.setQueryData('get-coupons', context.coupons);

        message.error('You can not delete coupon with orders');
      },
    },
  );
};

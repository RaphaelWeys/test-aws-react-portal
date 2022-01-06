import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Coupon } from '../../../interface/coupon';

export const useGetCoupons = () => {
  const client = useApi();

  return useQuery<Coupon[], AxiosError<Coupon[]>>('get-coupons', () =>
    client.get('/coupon/admin/list').then((res) => res.data),
  );
};

import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { Order } from '../../interface/order';

interface TValues {
  orderId: string;
  coupon: string;
}

export const useUpdateBasketCoupon = () => {
  const client = useApi();

  return useMutation<Order, AxiosError<Order>, TValues>((values) =>
    client.post('/order/applyCoupon', values).then((res) => res.data),
  );
};

import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useOrder } from '../../context/OrderContext';
import { Order } from '../../interface/order';

export const useGetOrder = (orderId: string) => {
  const client = useApi();
  const { setOrder } = useOrder();

  return useQuery<Order, AxiosError<Order>>(
    ['order', orderId],
    () => client.get(`/order/${orderId}`).then((res) => res.data),
    {
      onSuccess(data) {
        setOrder(data);
      },
    },
  );
};

import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useOrder } from '../../context/OrderContext';
import { Order } from '../../interface/order';

export const useValidatePayment = () => {
  const client = useApi();
  const { order } = useOrder();

  return useMutation<Order, AxiosError<Order>>(() =>
    client
      .post('/order/validatePayment', {
        orderId: order.id,
      })
      .then((res) => res.data),
  );
};

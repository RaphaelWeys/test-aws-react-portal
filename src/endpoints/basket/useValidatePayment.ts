import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { Order } from '../../interface/order';
import { useOrder } from '../../screen/Basket/BasketWrapper';

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

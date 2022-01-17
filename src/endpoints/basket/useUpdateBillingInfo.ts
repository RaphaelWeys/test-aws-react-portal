import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { Order } from '../../interface/order';
import { FormData } from '../../screen/Basket/BasketForm/BasketForm.interface';

interface TValues {
  orderId: string;
  billingInfo: FormData;
}

export const useUpdateBillingInfo = () => {
  const client = useApi();

  return useMutation<Order, AxiosError<Order>, TValues>((values) =>
    client.post('/order/billingInfo', values).then((res) => res.data),
  );
};

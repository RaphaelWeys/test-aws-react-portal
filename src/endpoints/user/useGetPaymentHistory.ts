import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { OrderPaid } from '../../interface/orderPaid';

export const useGetPaymentHistory = () => {
  const client = useApi();

  return useQuery<OrderPaid[], AxiosError<OrderPaid[]>>('payment-history', () =>
    client.get('/order/list').then((res) => res.data),
  );
};

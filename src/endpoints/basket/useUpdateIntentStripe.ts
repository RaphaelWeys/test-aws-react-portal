import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';

interface TValues {
  orderId: string;
  paymentMethod: string;
}

interface IntentStripe {
  amountToPay: number;
  vatAmount: number;
  clientSecret: string;
}

export const useUpdateIntentStripe = () => {
  const client = useApi();

  return useMutation<IntentStripe, AxiosError<IntentStripe>, TValues>((values) =>
    client.post('/order/createPaymentIntent', values).then((res) => res.data),
  );
};

import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';

interface OrderItem {
  quantity: number;
  name: string;
  description: string;
  price: number;
}
interface Order {
  _id: string;
  couponCode: string;
  couponValue: number;
  vatApply: boolean;
  vatAmount: number;
  amountToPay: number;
  paid: boolean;
  userId: string;
  name: string;
  company: string;
  affiliation: string;
  email: string;
  product: string;
  app: string;
  purpose: string;
  reference: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  contracts: number;
  items: OrderItem[];
  itemsAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  billingInfo: {
    company: string;
    email: string;
    address: string;
    postalCode: string;
    country: string;
    city: string;
    vtaNumber: string;
  };
  intentId: string;
  paymentMethod: string;
}

export const useGetOrdersList = () => {
  const client = useApi();

  return useMutation<Order[], AxiosError<Order[]>>('get-orders-list', (data) =>
    client.post('/order/admin/list', data).then((res) => res.data),
  );
};

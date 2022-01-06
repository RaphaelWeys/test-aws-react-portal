export interface OrderItem {
  quantity: number;
  name: string;
  description: string;
  price: number;
}

export interface Order {
  __v: number;
  _id: string;
  affiliation: string;
  amountToPay: number;
  app: string;
  company: string;
  contracts: 1;
  couponCode: string;
  couponValue: number;
  createdAt: string;
  email: string;
  id: string;
  items: OrderItem[];
  itemsAmount: number;
  name: string;
  paid: false;
  product: string;
  purpose: string;
  reference: string;
  subscriptionEnd: string;
  subscriptionStart: string;
  updatedAt: string;
  userId: string;
  vatAmount: number;
  vatApply: false;
}

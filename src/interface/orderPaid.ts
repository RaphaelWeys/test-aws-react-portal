export interface ItemPaid {
  quantity: 1;
  name: string;
  description: string;
  price: number;
}

export interface BillingInfo {
  company: string;
  email: string;
  address: string;
  postalCode: string;
  country: string;
  city: string;
  vtaNumber: string;
}

export interface OrderPaid {
  _id: string;
  couponCode: string;
  couponValue: number;
  vatApply: true;
  vatAmount: number;
  amountToPay: number;
  paid: true;
  userId: string;
  name: string;
  company: string;
  email: string;
  product: string;
  app: string;
  purpose: string;
  reference: string;
  subscriptionStart: string;
  subscriptionEnd: string;
  items: ItemPaid[];
  itemsAmount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  billingInfo: BillingInfo;
  intentId: string;
  paymentMethod: string;
  receiptUrl: string;
}

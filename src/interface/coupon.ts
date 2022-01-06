export interface CouponOrderOrder {
  _id: string;
  name: string;
  product: string;
  app: string;
  purpose: string;
  reference: string;
  id: string;
}

export interface CouponOrderUser {
  _id: string;
  company: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
}

export interface CouponOrder {
  order: CouponOrderOrder;
  user: CouponOrderUser | null;
  date: string;
  amount: number;
}

export interface CouponUser {
  _id: string;
  company: string;
  firstName: string;
  lastName: string;
  username: string;
  id: string;
}
export interface Coupon {
  multipleUsage: boolean;
  _id: string;
  code: string;
  app: string;
  value: number;
  purpose: string;
  validityStart: string;
  validityEnd: string;
  orders: CouponOrder[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  user?: CouponUser;
  id: string;
}
export interface CouponRaw {
  app: string;
  code: string;
  date: string;
  id: string;
  key: 0;
  multipleUsage: string;
  orders: CouponOrder[];
  purpose: string;
  user: string;
  userId: string;
  value: string;
}

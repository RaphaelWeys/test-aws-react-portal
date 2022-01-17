import React, { FC, useContext, useState } from 'react';

import { Order } from '../interface/order';

export interface IOrderContext {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const OrderContext = React.createContext<IOrderContext | undefined>(undefined);

const OrderProvider: FC = ({ children }) => {
  const [order, setOrder] = useState<Order>({} as Order);

  return <OrderContext.Provider value={{ order, setOrder }}>{children}</OrderContext.Provider>;
};

const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within a OrderContext');
  }
  return context;
};

export { OrderProvider, useOrder };

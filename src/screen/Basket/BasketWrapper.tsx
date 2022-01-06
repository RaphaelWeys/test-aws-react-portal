import React, { FC, useContext, useState } from 'react';

import { Order } from '../../interface/order';
import Basket from './Basket';

interface Props {
  className?: string;
}

export interface IOrderContext {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const OrderContext = React.createContext<IOrderContext | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within a OrderContext');
  }
  return context;
};

const BasketWrapper: FC<Props> = () => {
  const [order, setOrder] = useState<Order>({} as Order);

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      <Basket />
    </OrderContext.Provider>
  );
};

export default BasketWrapper;

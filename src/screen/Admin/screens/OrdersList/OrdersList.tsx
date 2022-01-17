import moment from 'moment';
import React, { FC } from 'react';
import styled from 'styled-components';

import ModalOrder from '../../../../components/Modal/ModalOrder';
import Table from '../../../../components/Table';
import { useGetOrdersList } from '../../../../endpoints/orders/useGetOrdersList';
import { getCurrencyFormatted } from '../../../../utils/number';

interface Props {
  className?: string;
}

const OrdersList: FC<Props> = ({ className }) => {
  const { data: orders, mutate: getOrders, isSuccess } = useGetOrdersList();
  const [selectedOrder, setSelectedOrder] = React.useState();

  React.useEffect(() => {
    getOrders();
  }, [getOrders]);

  const columns = React.useMemo(() => [
      {
        title: 'date',
        dataIndex: 'createdAt',
        key: 'date',
        render: (createdAt) => moment(createdAt).format('DD/MM/YYYY hh:mm'),
      },
      { title: 'company', dataIndex: 'company', key: 'company' },
      { title: 'name', dataIndex: 'name', key: 'name' },
      { title: 'paid', dataIndex: 'amountToPay', key: 'amount', render: (amount) => getCurrencyFormatted(amount) },
      { title: 'payment', dataIndex: 'paymentMethod', key: 'payment' },
      { title: 'app', dataIndex: 'app', key: 'app', render: (app) => (app === 'tender' ? 'MKP' : 'YOP') },
    ], []);

  if (!isSuccess) {
    return null;
  }

  return (
    <div className={className}>
      <Table
        columns={columns}
        dataSource={orders}
        onRow={(record) => ({
            onClick: () => {
              setSelectedOrder(record);
            },
          })}
      />

      {selectedOrder && <ModalOrder order={selectedOrder} onClose={() => setSelectedOrder(undefined)} />}
    </div>
  );
};

export default styled(OrdersList)``;

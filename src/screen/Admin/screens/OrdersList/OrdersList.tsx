import React, { FC } from 'react';
import styled from 'styled-components';
import { useGetOrdersList } from '../../../../endpoints/orders/useGetOrdersList';
import Table from '../../../../components/Table';
import { getCurrencyFormatted } from '../../../../utils/number';
import ModalOrder from '../../../../components/Modal/ModalOrder';
import moment from 'moment';

interface Props {
  className?: string;
}

const OrdersList: FC<Props> = ({ className }) => {
  const { data: orders, mutate: getOrders, isSuccess } = useGetOrdersList();
  const [selectedOrder, setSelectedOrder] = React.useState();

  React.useEffect(() => {
    getOrders();
  }, [getOrders]);

  const columns = React.useMemo(() => {
    return [
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
    ];
  }, []);

  if (!isSuccess) {
    return null;
  }

  return (
    <div className={className}>
      <Table
        columns={columns}
        dataSource={orders}
        onRow={(record) => {
          return {
            onClick: () => {
              setSelectedOrder(record);
            },
          };
        }}
      />

      {selectedOrder && <ModalOrder order={selectedOrder} onClose={() => setSelectedOrder(undefined)} />}
    </div>
  );
};

export default styled(OrdersList)``;

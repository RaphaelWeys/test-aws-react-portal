import React, { FC } from 'react';
import styled from 'styled-components';
import Modal from '../Modal';
import { Col, Row, Space } from 'antd';
import { HeaderOne, HeaderThree, TextRegular } from '../../../style/utils';
import Table from '../../Table';

interface Props {
  className?: string;
  order: any;
  onClose: () => void;
}

const ModalOrder: FC<Props> = ({ className, order, onClose }) => {
  const columns = React.useMemo(() => {
    return [
      { title: 'name', dataIndex: 'name', key: 'name' },
      { title: 'description', dataIndex: 'description', key: 'description' },
      { title: 'quantity', dataIndex: 'quantity', key: 'quantity' },
      { title: 'price', dataIndex: 'price', key: 'price' },
    ];
  }, []);

  return (
    <Modal visible className={className} footer={false} size="large" onCancel={onClose}>
      <Space direction="vertical" size="large">
        <HeaderOne>Details</HeaderOne>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <HeaderThree>Order info</HeaderThree>
            <TextRegular>Order id: {order._id}</TextRegular>
            <TextRegular>App: {order.app === 'tender' ? 'MKP' : 'YOP'}</TextRegular>
            <TextRegular>Product: {order.product}</TextRegular>
          </Col>
          <Col span={24}>
            <HeaderThree>User info</HeaderThree>
            <TextRegular>UserId: {order.userId}</TextRegular>
            <TextRegular>name: {order.name}</TextRegular>
            <TextRegular>company: {order.company}</TextRegular>
          </Col>
          <Col span={24}>
            <HeaderThree>Items</HeaderThree>
            <Table columns={columns} dataSource={order.items} isClickable={false} />
          </Col>
          <Col span={24}>
            <HeaderThree>Coupon</HeaderThree>
            <TextRegular>Coupon: {order.couponCode}</TextRegular>
            <TextRegular>value: {order.couponValue}</TextRegular>
          </Col>
          <Col span={24}>
            <HeaderThree>Amount to pay</HeaderThree>
            <TextRegular>Items amount: {order.itemsAmount}</TextRegular>
            <TextRegular>VAT applicable: {order.vatApply ? 'true' : 'false'}</TextRegular>
            <TextRegular>VAT amount: {order.vatAmount}</TextRegular>
            <TextRegular>Amount to pay: {order.amountToPay}</TextRegular>
          </Col>
          <Col span={24}>
            <HeaderThree>Billing</HeaderThree>
            <TextRegular>Company: {order.billingInfo?.company}</TextRegular>
            <TextRegular>Name: {order.billingInfo?.name}</TextRegular>
            <TextRegular>E-mail: {order.billingInfo?.email}</TextRegular>
            <TextRegular>Address: {order.billingInfo?.address}</TextRegular>
            <TextRegular>Postal code: {order.billingInfo?.postalCode}</TextRegular>
            <TextRegular>Country: {order.billingInfo?.country}</TextRegular>
            <TextRegular>VAT Number: {order.billingInfo?.vatNumber}</TextRegular>
          </Col>
          <Col span={24}>
            <HeaderThree>Stripe</HeaderThree>
            <TextRegular>Intent: {order.intentId}</TextRegular>
            <TextRegular>Payment method: {order.paymentMethod}</TextRegular>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
};

export default styled(ModalOrder)``;

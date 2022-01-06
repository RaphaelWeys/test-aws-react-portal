import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';

import BasketItem from '../BasketItem';
import { orderFake } from '../../AppBasket/__tests__/appBasket.test';
import { formatNumber } from '../../../../utils';

jest.mock('axios');

const order = orderFake();

test('It should display the correct numbers of items', () => {
  const mockNextStep = jest.fn();

  const { getAllByTestId } = render(<BasketItem order={order} nextStep={mockNextStep} setOrder={() => {}} />);

  expect(getAllByTestId(/wrapperPrice/i).length).toEqual(order.items.length);
});

test('It should go next step when pressing the button Next', async () => {
  const mockNextStep = jest.fn();

  const { getByText } = render(<BasketItem order={order} nextStep={mockNextStep} setOrder={() => {}} />);

  fireEvent.click(getByText(/global-next/i));

  expect(mockNextStep).toHaveBeenCalledTimes(1);
});

test('It should validate coupon', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({
    data: {
      couponCode: 'MINUS200',
    },
  });
  const mockSetOrder = jest.fn();
  const { getByText, getByTestId, queryByTestId } = render(
    <BasketItem order={order} nextStep={() => {}} setOrder={mockSetOrder} />,
  );
  const inputCountValue = 'coupon-test';

  expect(queryByTestId(/inputCode/i)).toBeNull();

  fireEvent.click(getByText(/basket-item-promo-code/i));

  const inputCoupon = getByTestId(/inputCode/i);

  expect(inputCoupon).toBeInTheDocument();

  fireEvent.change(inputCoupon, { target: { value: inputCountValue } });
  fireEvent.keyPress(inputCoupon, { key: 'Enter', code: 13, charCode: 13 });

  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: { coupon: inputCountValue, orderId: order.id },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: '/order/applyCoupon',
    }),
  );

  expect(mockSetOrder).toHaveBeenCalled();
  expect(queryByTestId(/inputCode/i)).toBeNull();

  const couponValueDisplay = getByTestId(/couponValueId/i);
  expect(couponValueDisplay).toHaveTextContent(`${formatNumber(order.couponValue)}`);

  const couponCodeDisplay = getByTestId(/couponCodeId/i);
  expect(couponCodeDisplay).toHaveTextContent(`${order.couponCode}`);
});

test('It should display an error message if coupon is not correct', async () => {
  (axios.request as jest.Mock).mockRejectedValueOnce({ response: { status: 405 } });
  const { getByText, getByTestId } = render(<BasketItem order={order} nextStep={() => {}} setOrder={() => {}} />);

  fireEvent.click(getByText(/basket-item-promo-code/i));

  const inputCoupon = getByTestId(/inputCode/i);
  const inputCountValue = 'coupon-test';

  expect(inputCoupon).toBeInTheDocument();

  fireEvent.change(inputCoupon, { target: { value: inputCountValue } });
  fireEvent.keyPress(inputCoupon, { key: 'Enter', code: 13, charCode: 13 });

  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: { coupon: inputCountValue, orderId: order.id },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: '/order/applyCoupon',
    }),
  );

  expect(getByTestId(/inputError/i)).toBeInTheDocument();
  expect(getByTestId(/inputError/i)).toHaveTextContent('basket-item-incorrect-coupon');
});

import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';

import BasketPay from '../BasketPay';
import { orderFake } from '../../AppBasket/__tests__/appBasket.test';

const props = {
  previousStep: jest.fn(),
  order: orderFake(),
  nextStep: jest.fn(),
};

interface IChildren {
  children: React.ReactNode;
}
jest.mock('axios');
jest.mock('little-state-machine', () => ({
  useStateMachine: jest.fn(() => ({ action: jest.fn(), state: {} })),
}));
jest.mock('@stripe/react-stripe-js', () => ({
  useStripe: jest.fn(() => ({
    confirmCardPayment: jest.fn().mockResolvedValueOnce({
      error: '',
      paymentIntent: {
        status: 'succeeded',
      },
    }),
  })),
  useElements: jest.fn(() => ({
    getElement: jest.fn(() => true),
  })),
  Elements: ({ children }: IChildren) => <div>{children}</div>,
  CardElement: ({ children }: IChildren) => <div>{children}</div>,
}));

afterEach(() => {
  jest.clearAllMocks();
});

test("It should redirect to callback if it's free", async () => {
  const callback = 'https://fake-address.com';
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };
  window.location.search = `callback=${callback}`;
  (axios.request as jest.Mock).mockResolvedValue({
    data: {
      amountToPay: 1000,
      vatAmount: 200,
      clientSecret: 'client_secret',
    },
  });
  const { getByText } = render(<BasketPay {...props} order={orderFake({ itemsAmount: 1000, couponValue: 1000 })} />);
  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: { orderId: expect.any(String), paymentMethod: 'free' },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: '/order/createPaymentIntent',
    }),
  );
  fireEvent.click(getByText(/basket-pay-continue$/i));

  // Called when we valid the payment for backEnd
  await waitFor(() => expect(axios.request).toHaveBeenCalledTimes(2));
  expect(window.location.assign).toHaveBeenCalledWith(callback);
  window.location = location;
});

test("It should not show options payment and card form if it's free", async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({
    data: {
      amountToPay: 1000,
      vatAmount: 200,
      clientSecret: 'client_secret',
    },
  });
  const { queryByText } = render(<BasketPay {...props} order={orderFake({ itemsAmount: 1000, couponValue: 1000 })} />);

  await waitFor(() => {});

  expect(queryByText(/basket-pay-SEPA$/i)).toBeNull();
  expect(queryByText(/basket-pay-credit-card$/i)).toBeNull();
  expect(queryByText(/basket-card-form$/i)).toBeNull();
});

test("It should create intent with \"paymentMethod: 'free'", async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({});

  render(<BasketPay {...props} order={orderFake({ itemsAmount: 1000, couponValue: 1000 })} />);

  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: { orderId: expect.any(String), paymentMethod: 'free' },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: '/order/createPaymentIntent',
    }),
  );
});

test('It should get intent stripe', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({});

  const { getByLabelText } = render(<BasketPay {...props} />);

  expect(getByLabelText(/loading/i)).toBeInTheDocument();

  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: { orderId: props.order.id, paymentMethod: 'card' },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: '/order/createPaymentIntent',
    }),
  );
});

test('It should submit form', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: { clientSecret: 'client_secret' } });

  const { getByLabelText, getByText } = render(<BasketPay {...props} />);
  expect(getByLabelText(/loading/i)).toBeInTheDocument();

  await waitFor(() => expect(axios.request).toHaveBeenCalledTimes(1));

  expect(axios.request).toHaveBeenCalledWith({
    data: { orderId: props.order.id, paymentMethod: 'card' },
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: '/order/createPaymentIntent',
  });

  fireEvent.click(getByText(/basket-pay$/i));

  (axios.request as jest.Mock).mockResolvedValueOnce({});

  // TODO try to make it works
  // const stripe = useStripe();
  // await waitFor(() => expect(stripe?.confirmCardPayment as jest.Mock).toHaveBeenCalled());

  await waitFor(() => expect(axios.request).toHaveBeenCalledTimes(2));

  expect(axios.request).toHaveBeenLastCalledWith({
    data: { orderId: props.order.id },
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: '/order/validatePayment',
  });
});

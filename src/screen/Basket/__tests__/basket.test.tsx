import 'jest-styled-components';

import { render as rtlRender, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';
import { Router } from 'react-router-dom';

import { LocalContext } from '../../../context/LocalContext';
import { UserInfoContext } from '../../../context/UserInfoContext';
import history from '../../../router/history';
import Basket from '../Basket';

interface IStateMachineProvider {
  children: React.ReactNode;
}

jest.mock('axios');
jest.mock('little-state-machine', () => ({
  StateMachineProvider: ({ children }: IStateMachineProvider) => <div>{children}</div>,
}));

const data = {
  app: 'tender',
  itemsAmount: 1500,
  couponValue: 500,
  items: [{ quantity: 1, name: 'name-test', description: 'description-test', price: 1500 }],
};

const render = (ui: React.ReactNode) =>
  rtlRender(
    <Router history={history}>
      <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
        <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>{ui}</LocalContext.Provider>
      </UserInfoContext.Provider>
    </Router>,
  );

test('It should use the orderId in the URL to make the request', async () => {
  (axios.request as jest.Mock).mockResolvedValue({ data });
  const orderId = 123456789;
  const fakeCallback = 'https://fake-address.com';
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };
  window.location.search = `orderId=${orderId}&callback=${fakeCallback}`;
  const { queryByRole } = render(<Basket />);

  expect(queryByRole('img')).toBeInTheDocument();

  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      headers: { 'Content-Type': 'application/json' },
      method: 'get',
      url: `/order/${orderId}`,
    }),
  );

  window.location = location;
});

test('It should match snapshot', async () => {
  (axios.request as jest.Mock).mockResolvedValue({ data });
  const { container } = render(<Basket />);

  await waitFor(() => expect(axios.request).toHaveBeenCalled());

  expect(container).toMatchSnapshot();
});

test('It should show an appropriate message if there is an error or empty order', async () => {
  (axios.request as jest.Mock).mockRejectedValueOnce({
    response: {
      status: 400,
    },
  });
  const fakeCallback = 'https://fake-address.com';
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };
  window.location.search = `callback=${fakeCallback}`;

  const { getByText } = render(<Basket />);

  await waitFor(() => expect(axios.request).toHaveBeenCalled());

  expect(getByText('basket-order-not-found')).toBeInTheDocument();
  window.location = location;
});

test('It should redirect to home page if no callback are in URL', async () => {
  const { getByTestId } = render(<Basket />);

  await waitFor(() => expect(getByTestId(/redirect-component/i)).toBeInTheDocument());
});

test('It should redirect to home page if order is already paid', async () => {
  (axios.request as jest.Mock).mockResolvedValue({ data: { ...data, paid: true } });
  const fakeCallback = 'https://fake-address.com';
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };
  window.location.search = `callback=${fakeCallback}`;

  const { getByTestId } = render(<Basket />);

  await waitFor(() => expect(getByTestId(/redirect-component/i)).toBeInTheDocument());

  window.location = location;
});

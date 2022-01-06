import React from 'react';
import { fireEvent, render as rtlRender } from '@testing-library/react';
import faker from 'faker';

import AppBasket from '../AppBasket';
import { Order } from '../../../../interface/order';
import { LocalContext } from '../../../../context/LocalContext';
import { UserInfoContext } from '../../../../context/UserInfoContext';

export const orderFake = (overrides?: { [k: string]: string | number | null }): Order => ({
  couponCode: faker.lorem.word(),
  couponValue: faker.random.number(),
  vatApply: faker.random.boolean(),
  vatAmount: parseInt(faker.commerce.price(200, 300), 10),
  amountToPay: parseInt(faker.commerce.price(1200, 2300), 10),
  paid: faker.random.boolean(),
  _id: `${faker.random.number()}`,
  userId: `${faker.random.number()}`,
  name: faker.name.firstName(),
  company: faker.company.companyName(),
  email: faker.internet.email(),
  app: 'follow',
  purpose: '',
  reference: '',
  items: Array.from({ length: Math.floor(Math.random() * Math.floor(10)) }).map(() => ({
    quantity: 1,
    name: faker.random.word(),
    description: faker.lorem.sentence(),
    price: parseInt(faker.commerce.price(1200, 2300), 10),
  })),
  itemsAmount: parseInt(faker.commerce.price(1200, 2300), 10),
  createdAt: '',
  updatedAt: '',
  __v: 0,
  id: `${faker.random.number()}`,
  ...overrides,
});

const render = (ui: React.ReactNode) =>
  rtlRender(
    <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
      <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>{ui}</LocalContext.Provider>
    </UserInfoContext.Provider>,
  );

test('It should have a button to cancel the order', () => {
  const callback = 'https://fake-address.com';
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };
  window.location.search = `callback=${callback}`;

  const { getByText } = render(<AppBasket orderAlreadyPaid={false} setOrder={() => {}} icon="" order={orderFake()} />);

  const boutonCancel = getByText(/basket-cancel/i);
  fireEvent.click(boutonCancel);

  expect(window.location.assign).toHaveBeenCalledWith(callback);

  window.location = location;
});

test('It should display the correct title depending on response backend', () => {
  const { getByText, rerender } = render(
    <AppBasket orderAlreadyPaid={false} setOrder={() => {}} icon="" order={orderFake()} />,
  );

  expect(getByText(/basket-title-optimization/i)).toBeInTheDocument();

  rerender(
    <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
      <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>
        <AppBasket orderAlreadyPaid={false} setOrder={() => {}} icon="" order={orderFake({ app: 'tender' })} />
      </LocalContext.Provider>
    </UserInfoContext.Provider>,
  );

  expect(getByText(/basket-title-marketplace/i)).toBeInTheDocument();
});

test('It should redirect me on the correct contact us link', () => {
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };

  const { getByText } = render(<AppBasket orderAlreadyPaid={false} setOrder={() => {}} icon="" order={orderFake()} />);

  fireEvent.click(getByText(/basket-item-contact-2/i));
  expect(window.location.assign).toHaveBeenCalled();

  window.location = location;
});

test('It should display the correct message if order is already paid', () => {
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };

  const { getByText } = render(<AppBasket orderAlreadyPaid setOrder={() => {}} icon="" order={orderFake()} />);

  expect(getByText('basket-title-already-paid')).toBeInTheDocument();
  fireEvent.click(getByText(/global-continue/i));
  expect(window.location.assign).toHaveBeenCalled();

  window.location = location;
});

import { fireEvent, render as rtlRender } from '@testing-library/react';
import faker from 'faker';
import React from 'react';

import { LocalContext } from '../../../../context/LocalContext';
import { UserInfoContext } from '../../../../context/UserInfoContext';
import { Order } from '../../../../interface/order';
import AppBasket from '../AppBasket';

export const orderFake = (overrides?: { [k: string]: string | number | boolean | null }): Order => ({
  __v: 0,
  _id: `${faker.random.number()}`,
  affiliation: faker.lorem.word(),
  amountToPay: parseInt(faker.commerce.price(1200, 2300), 10),
  app: 'follow',
  company: faker.company.companyName(),
  contracts: faker.random.number(),
  couponCode: faker.lorem.word(),
  couponValue: faker.random.number(),
  createdAt: '',
  email: faker.internet.email(),
  id: `${faker.random.number()}`,
  items: Array.from({ length: Math.floor(Math.random() * Math.floor(10)) }).map(() => ({
    quantity: 1,
    name: faker.random.word(),
    description: faker.lorem.sentence(),
    price: parseInt(faker.commerce.price(1200, 2300), 10),
  })),
  itemsAmount: parseInt(faker.commerce.price(1200, 2300), 10),
  name: faker.name.firstName(),
  paid: faker.random.boolean(),
  product: faker.lorem.word(),
  purpose: '',
  reference: '',
  subscriptionEnd: faker.lorem.word(),
  subscriptionStart: faker.lorem.word(),
  updatedAt: '',
  userId: `${faker.random.number()}`,
  vatAmount: parseInt(faker.commerce.price(200, 300), 10),
  vatApply: faker.random.boolean(),
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
  window.location = { assign: jest.fn() };
  window.location.search = `callback=${callback}`;

  const { getByText } = render(<AppBasket icon="" order={orderFake()} orderAlreadyPaid={false} setOrder={() => {}} />);

  const boutonCancel = getByText(/basket-cancel/i);
  fireEvent.click(boutonCancel);

  expect(window.location.assign).toHaveBeenCalledWith(callback);

  window.location = location;
});

test('It should display the correct title depending on response backend', () => {
  const { getByText, rerender } = render(
    <AppBasket icon="" order={orderFake()} orderAlreadyPaid={false} setOrder={() => {}} />,
  );

  expect(getByText(/basket-title-optimization/i)).toBeInTheDocument();

  rerender(
    <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
      <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>
        <AppBasket icon="" order={orderFake({ app: 'tender' })} orderAlreadyPaid={false} setOrder={() => {}} />
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

  const { getByText } = render(<AppBasket icon="" order={orderFake()} orderAlreadyPaid={false} setOrder={() => {}} />);

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

  const { getByText } = render(<AppBasket orderAlreadyPaid icon="" order={orderFake()} setOrder={() => {}} />);

  expect(getByText('basket-title-already-paid')).toBeInTheDocument();
  fireEvent.click(getByText(/global-continue/i));
  expect(window.location.assign).toHaveBeenCalled();

  window.location = location;
});

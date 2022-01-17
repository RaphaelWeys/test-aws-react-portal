import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';

import { LocalContext } from '../../../context/LocalContext';
import { UserInfoContext } from '../../../context/UserInfoContext';
import { CONTACT_US_ENGLISH, CONTACT_US_ITALIAN } from '../../../hooks/useContactUs';
import PaymentHistory from '../PaymentHistory';

jest.mock('axios');

const fakeData = [
  {
    subscriptionStart: '2020-07-01',
    items: [
      {
        quantity: 1,
        name: 'YEM Optimization subscription',
        description: '1 year subscription - 4 contracts',
        price: 1500,
      },
    ],
  },
  {
    subscriptionStart: '2020-07-01',
    items: [
      {
        quantity: 1,
        name: 'YEM Optimization subscription',
        description: '1 year subscription - 4 contracts',
        price: 1500,
      },
    ],
  },
  {
    subscriptionStart: '2020-07-01',
    items: [
      {
        quantity: 1,
        name: 'YEM Optimization subscription',
        description: '1 year subscription - 4 contracts',
        price: 1500,
      },
    ],
  },
];

const render = (ui: React.ReactNode) =>
  rtlRender(
    <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
      <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>{ui}</LocalContext.Provider>
    </UserInfoContext.Provider>,
  );

test('It should show a spinner then get the history of the payments', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: fakeData });

  const { getByText, getAllByTestId, queryByRole } = render(<PaymentHistory />);

  expect(queryByRole('img')).toBeInTheDocument();

  await waitFor(() => expect(getByText(/payment-history-title/i)).toBeInTheDocument());

  expect(getAllByTestId('payment-history-item')).toHaveLength(fakeData.length);
});

test('It should show message when 0 products were found', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: [] });

  const { getByText } = render(<PaymentHistory />);

  await waitFor(() => expect(getByText(/payment-history-title/i)).toBeInTheDocument());

  expect(getByText('payment-history-no-order-found')).toBeInTheDocument();
});

test('It should redirect to the correct "Contact us" page', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: [] });
  const { location } = window;
  delete window.location;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.location = { assign: jest.fn() };

  const getValue = (local: string) => ({
    local,
    setLocal: () => {},
  });

  const { getByText, rerender } = rtlRender(
    <LocalContext.Provider value={getValue('it')}>
      <PaymentHistory />
    </LocalContext.Provider>,
  );

  await waitFor(() => expect(getByText(/payment-history-title/i)).toBeInTheDocument());

  fireEvent.click(getByText('payment-history-button-3'));

  expect(window.location.assign).toHaveBeenCalledWith(CONTACT_US_ITALIAN);

  rerender(
    <LocalContext.Provider value={getValue('en')}>
      <PaymentHistory />
    </LocalContext.Provider>,
  );
  fireEvent.click(getByText('payment-history-button-3'));

  expect(window.location.assign).toHaveBeenCalledWith(CONTACT_US_ENGLISH);
  window.location = location;
});

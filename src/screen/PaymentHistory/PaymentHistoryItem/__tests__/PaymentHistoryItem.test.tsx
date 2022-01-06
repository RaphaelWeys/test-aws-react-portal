import React from 'react';
import 'jest-styled-components';
import { render, fireEvent } from '@testing-library/react';

import PaymentHistoryItem from '../PaymentHistoryItem';
import { formatNumber } from '../../../../utils';

const getProps = (override?: { [key: string]: string | number | boolean | null }) => ({
  className: 'sc-pJurq cwzEZF',
  icon: '/static/media/picto-optimization.5dca1da9.svg',
  startDate: '01/07/2020',
  title: 'YEM Optimization subscription',
  description: '1 year subscription - 4 contracts',
  amount: 1800,
  urlToRedirect:
    'https://pay.stripe.com/receipts/acct_1G877uAkgNStjmVM/ch_1H03X4AkgNStjmVMZ9ZxDFqL/rcpt_HZBusReohafFkqBA44tWB8CjHgRoQZX',
  isLast: true,
  ...override,
});

test('it should open new tab with the invoice', () => {
  const props = getProps();
  const { getByTestId } = render(<PaymentHistoryItem {...props} />);

  const { open } = window;
  delete window.open;
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  window.open = jest.fn();

  fireEvent.click(getByTestId(/button-download/i));

  expect(window.open).toHaveBeenCalledWith(props.urlToRedirect, '_blank');
  window.open = open;
});

test('It should match snapshot', async () => {
  const { container } = render(<PaymentHistoryItem {...getProps()} />);

  expect(container).toMatchSnapshot();
});

test('It should display the price with the correct format', () => {
  const props = getProps();
  const { getByTestId } = render(<PaymentHistoryItem {...props} />);

  expect(getByTestId(/price-test/i)).toHaveTextContent(`${formatNumber(props.amount)} €`);
});

test('It should hide the invoice button if amount is 0', () => {
  const props = getProps({ urlToRedirect: null });
  const { queryByTestId } = render(<PaymentHistoryItem {...props} />);

  expect(queryByTestId(/button-download/i)).toBeNull();
});

import { fireEvent, render as rtlRender } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import { LocalContext } from '../../../context/LocalContext';
import { UserInfoContext } from '../../../context/UserInfoContext';
import history from '../../../router/history';
import theme from '../../../style/theme';
import Header from '../Header';

const render = (ui: React.ReactNode) =>
  rtlRender(
    <ThemeProvider theme={theme}>
      <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
        <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>{ui}</LocalContext.Provider>
      </UserInfoContext.Provider>
    </ThemeProvider>,
  );

test('It should redirect to the home page', () => {
  const { getByTestId } = render(
    <Router history={history}>
      <Header />
    </Router>,
  );

  const logo = getByTestId(/logo-test/i);

  fireEvent.click(logo);
});

test('It should show the popover', () => {
  const { getByTestId } = render(<Header />);

  const enterpriseName = getByTestId(/enterprise-testid/i);

  fireEvent.click(enterpriseName);

  expect(getByTestId(/popover-testid/i)).toBeInTheDocument();
});

test('It should redirect to the invoice payment page', () => {
  history.push = jest.fn();

  const { getByTestId, getByText } = render(
    <Router history={history}>
      <Header />
    </Router>,
  );

  const enterpriseName = getByTestId(/enterprise-testid/i);

  fireEvent.click(enterpriseName);

  const linkInvoicePayment = getByText(/header-invoice-payment/i);

  fireEvent.click(linkInvoicePayment);
  expect(history.push).toHaveBeenLastCalledWith('/payment-history');
});

test('It should redirect to the update password page', async () => {
  history.push = jest.fn();

  const { getByTestId, getByText } = render(
    <Router history={history}>
      <Header />
    </Router>,
  );

  const enterpriseName = getByTestId(/enterprise-testid/i);

  fireEvent.click(enterpriseName);

  const linkUpdatePassword = getByText(/header-change-password/i);

  fireEvent.click(linkUpdatePassword);
  expect(history.push).toHaveBeenLastCalledWith('/update-password');
});

test('It should redirect to logout page', () => {
  history.push = jest.fn();

  const { getByTestId, getByText } = render(
    <Router history={history}>
      <Header />
    </Router>,
  );

  const enterpriseName = getByTestId(/enterprise-testid/i);

  fireEvent.click(enterpriseName);

  const linkLogout = getByText(/header-log-out/i);

  fireEvent.click(linkLogout);
  expect(history.push).toHaveBeenLastCalledWith('/logout');
});

test('It should show general condition modal', () => {
  const { getByTestId, getByText } = render(<Header />);

  const enterpriseName = getByTestId(/enterprise-testid/i);

  fireEvent.click(enterpriseName);

  const linkModalGeneralCondition = getByText(/header-general-condition/i);

  fireEvent.click(linkModalGeneralCondition);
  expect(getByText(/header-modal-general-content-info/i)).toBeInTheDocument();
});

test('It should show privacy modal', () => {
  const { getByTestId, getByText } = render(<Header />);

  const enterpriseName = getByTestId(/enterprise-testid/i);

  fireEvent.click(enterpriseName);

  const linkModalGeneralCondition = getByText(/header-privacy-disclaimer/i);

  fireEvent.click(linkModalGeneralCondition);
  expect(getByText(/header-modal-privacy-content-info/i)).toBeInTheDocument();
});

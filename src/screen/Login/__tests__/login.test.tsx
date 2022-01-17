import { fireEvent, render as renderUi, waitFor } from '@testing-library/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react';
import { Router } from 'react-router-dom';

import { LocalContext } from '../../../context/LocalContext';
import { UserInfoContext } from '../../../context/UserInfoContext';
import history from '../../../router/history';
import Login from '../Login';

jest.mock('axios');
jest.mock('js-cookie');

beforeAll(() => {
  jest.spyOn(history, 'push').mockImplementation(() => jest.fn());
});

afterAll(() => {
  (history.push as jest.Mock).mockRestore();
});

const localValue = { local: 'string', setLocal: jest.fn() };
const userInfoValue = { userInfo: {}, setUserInfo: jest.fn() };

const render = (ui: React.ReactNode) => renderUi(
    <Router history={history}>
      <LocalContext.Provider value={localValue}>
        <UserInfoContext.Provider value={userInfoValue}>{ui}</UserInfoContext.Provider>
      </LocalContext.Provider>
    </Router>,
  );

test('It should authenticate with correct IDs', async () => {
  const email = 'test@email.com';
  const password = 'password';
  const data = {
    username: email,
    password,
    token: '123456789',
  };
  (axios.request as jest.Mock).mockResolvedValueOnce({ data });
  (Cookies.set as jest.Mock).mockImplementation(() => {});

  const { getByLabelText, getByText } = render(<Login />);
  const inputEmail = getByLabelText(/global-email/i);
  const inputPassword = getByLabelText(/global-password/i);
  const submitBtn = getByText(/login-connection/i);
  fireEvent.change(inputEmail, { target: { value: email } });
  fireEvent.change(inputPassword, { target: { value: password } });
  fireEvent.click(submitBtn);

  await waitFor(() => expect(axios.request).toHaveBeenCalledTimes(1));

  expect(axios.request).toHaveBeenLastCalledWith({
    data: { password, username: email },
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: '/users/authenticate',
  });
  expect(Cookies.set).toHaveBeenCalledTimes(1);

  expect(Cookies.set).toHaveBeenLastCalledWith('yem_jwt', data.token, {
    domain: process.env.REACT_APP_SUB_DOMAIN,
    expires: (Cookies.set as jest.Mock).mock.calls[0][2].expires,
    path: '/',
  });

  expect(userInfoValue.setUserInfo).toHaveBeenCalledWith(data);
});

test('It should redirect if account is not validated', async () => {
  const email = 'test@email.com';
  const password = 'password';
  const data = {
    username: email,
    password,
    validated: false,
    _id: '123456789',
  };
  (axios.request as jest.Mock).mockResolvedValueOnce({ data });
  const { getByLabelText, getByText } = render(<Login />);

  const inputEmail = getByLabelText(/global-email/i);
  const inputPassword = getByLabelText(/global-password/i);
  const submitBtn = getByText(/login-connection/i);
  fireEvent.change(inputEmail, { target: { value: email } });
  fireEvent.change(inputPassword, { target: { value: password } });
  fireEvent.click(submitBtn);

  await waitFor(() => expect(axios.request).toHaveBeenCalledTimes(1));

  // eslint-disable-next-line no-underscore-dangle
  expect(history.push).toHaveBeenCalledWith(`/confirmEmail?userid=${data._id}`);
});

test('It should display error when authentication fail', async () => {
  const email = 'test@email.com';
  const password = 'password';
  const errorCode = 400;
  (axios.request as jest.Mock).mockRejectedValue({
    response: {
      status: errorCode,
    },
  });

  const { queryByText, getByLabelText, getByText } = render(<Login />);

  expect(queryByText(`login-alert-error-${errorCode}`)).toBeFalsy();

  const inputEmail = getByLabelText(/global-email/i);
  const inputPassword = getByLabelText(/global-password/i);
  const submitBtn = getByText(/login-connection/i);
  fireEvent.change(inputEmail, { target: { value: email } });
  fireEvent.change(inputPassword, { target: { value: password } });
  fireEvent.click(submitBtn);

  await waitFor(() => expect(getByText(`login-alert-error-${errorCode}`)).toBeInTheDocument());
});

test('It should show modal to reset password', () => {
  const { getByText } = render(<Login />);
  const forgetPasswordButton = getByText('login-forgotten-password');

  fireEvent.click(forgetPasswordButton);

  expect(getByText('forgot-password-title')).toBeTruthy();
});

test('It should redirect to the register page', () => {
  const { getByText } = render(<Login />);

  const registerLink = getByText('login-create-account');
  expect(registerLink).toHaveAttribute('href', '/register');
});

import { render as rtlRender } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';

import Register from '..';
import history from '../../../router/history';
import { UserInfoContext } from '../../../context/UserInfoContext';
import { LocalContext } from '../../../context/LocalContext';

interface IStateMachineProvider {
  children: React.ReactNode;
}
jest.mock('little-state-machine', () => ({
  StateMachineProvider: ({ children }: IStateMachineProvider) => <div>{children}</div>,
  useStateMachine: jest.fn(() => ({ action: jest.fn(), state: {} })),
  createStore: jest.fn(),
}));

const render = (ui: React.ReactNode) =>
  rtlRender(
    <Router history={history}>
      <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
        <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>{ui}</LocalContext.Provider>
      </UserInfoContext.Provider>
    </Router>,
  );

test('It should have a Link to redirect on the login page', () => {
  const { getByText } = render(<Register />);
  const linkToHomePage = getByText(/register-connection-link/i);

  expect(linkToHomePage).toHaveAttribute('href', '/login');
});

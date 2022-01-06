import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import i18next from 'i18next';
import axios from 'axios';

import SelectLang from '../SelectLang';
import { LocalContext } from '../../../context/LocalContext';
import { UserInfoContext } from '../../../context/UserInfoContext';

jest.mock('i18next');
jest.mock('axios');

test('It should call onChange method', () => {
  const value = {
    local: 'en',
    setLocal: jest.fn(),
  };
  const { getByRole, getByText } = render(
    <LocalContext.Provider value={value}>
      <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
        <SelectLang />
      </UserInfoContext.Provider>
    </LocalContext.Provider>,
  );

  const selectInput = getByRole('combobox');

  fireEvent.change(selectInput, { target: { value: 'random-value' } });
  fireEvent.click(getByText(/^IT$/));

  expect(localStorage.setItem).toHaveBeenLastCalledWith('local', 'it');
  expect(value.setLocal).toHaveBeenLastCalledWith('it');
  expect(i18next.changeLanguage).toHaveBeenLastCalledWith('it');
});

test('It should call setUserInfo', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: { _id: 123456789 } });
  const value = {
    userInfo: { firstName: 'property' },
    setUserInfo: jest.fn(),
  };
  const { getByRole, getByText } = render(
    <UserInfoContext.Provider value={value}>
      <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>
        <SelectLang />
      </LocalContext.Provider>
    </UserInfoContext.Provider>,
  );

  const selectInput = getByRole('combobox');

  fireEvent.change(selectInput, { target: { value: 'random-value' } });
  fireEvent.click(getByText(/^IT$/));

  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: { language: 'it' },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: '/users/setLanguage',
    }),
  );
  expect(value.setUserInfo).toHaveBeenCalledWith({ ...value.userInfo, language: 'it' });
});

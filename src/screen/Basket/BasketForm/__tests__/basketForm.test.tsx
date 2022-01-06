import React from 'react';
import { render as rtlRender, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';

import BasketForm from '../BasketForm';
import { orderFake } from '../../AppBasket/__tests__/appBasket.test';
import { UserInfoContext } from '../../../../context/UserInfoContext';
import { LocalContext } from '../../../../context/LocalContext';

const props = {
  previousStep: jest.fn(),
  order: orderFake(),
  nextStep: jest.fn(),
};

afterEach(() => {
  props.previousStep.mockReset();
  props.nextStep.mockReset();
});

interface IStateMachineProvider {
  children: React.ReactNode;
}

jest.mock('axios');
jest.mock('little-state-machine', () => ({
  StateMachineProvider: ({ children }: IStateMachineProvider) => <div>{children}</div>,
  useStateMachine: jest.fn(() => ({ action: jest.fn(), state: {} })),
}));

const render = (ui: React.ReactNode) =>
  rtlRender(
    <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
      <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>{ui}</LocalContext.Provider>
    </UserInfoContext.Provider>,
  );

test('It should go previous step when button previous is clicked', () => {
  const { getByText } = render(<BasketForm {...props} />);

  fireEvent.click(getByText(/global-back/i));

  expect(props.previousStep).toHaveBeenCalled();
});

test('It should call axios to update info billing and then go next step', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({});
  const { getByText, queryAllByText, getByLabelText, getAllByText, getByRole } = render(<BasketForm {...props} />);

  fireEvent.click(getByText(/global-next/i));

  await waitFor(() => {
    expect(getAllByText(/global-field-required/i).length).toEqual(6);
  });

  const basketCompanyValue = 'company-test';
  const basketEmailValue = 'email-test-';
  const basketAddressValue = 'address-test';
  const basketPostalCodeValue = 'postalCode-test';
  const basketCountryValue = 'Czechia';
  const basketCityValue = 'city-test';
  const basketVtaNumberValue = 'DE9879877';

  const basketCompany = getByLabelText(/basket-form-company/i);
  const basketEmail = getByLabelText(/basket-form-email/i);
  const basketAddress = getByLabelText(/basket-form-address/i);
  const basketPostalCode = getByLabelText(/basket-form-postalCode/i);
  const basketCountry = getByRole('combobox');
  const basketCity = getByLabelText(/basket-form-city/i);
  const basketVtaNumber = getByLabelText(/basket-form-vtaNumber/i);

  fireEvent.change(basketCompany, { target: { value: basketCompanyValue } });
  fireEvent.change(basketEmail, { target: { value: basketEmailValue } });
  fireEvent.change(basketAddress, { target: { value: basketAddressValue } });
  fireEvent.change(basketPostalCode, { target: { value: basketPostalCodeValue } });
  fireEvent.change(basketCountry, { target: { value: 'random-value' } });
  fireEvent.change(basketCity, { target: { value: basketCityValue } });
  fireEvent.change(basketVtaNumber, { target: { value: basketVtaNumberValue } });

  await waitFor(() => {});
  fireEvent.click(getByText(basketCountryValue));
  await waitFor(() => expect(queryAllByText(/global-field-required/i).length).toEqual(0));

  fireEvent.click(getByText(/global-next/i));
  await waitFor(() => expect(axios.request).toHaveBeenCalledTimes(1));
  expect(axios.request).toHaveBeenCalledWith({
    data: {
      billingInfo: {
        address: basketAddressValue,
        city: basketCityValue,
        company: basketCompanyValue,
        country: basketCountryValue,
        email: basketEmailValue,
        postalCode: basketPostalCodeValue,
        vtaNumber: basketVtaNumberValue,
      },
      orderId: expect.any(String),
    },
    headers: { 'Content-Type': 'application/json' },
    method: 'post',
    url: '/order/billingInfo',
  });
  expect(props.nextStep).toHaveBeenCalledTimes(1);
});

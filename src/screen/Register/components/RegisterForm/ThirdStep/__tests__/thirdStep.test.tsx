import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react';
import React from 'react';
import { Router } from 'react-router-dom';

import { LocalContext } from '../../../../../../context/LocalContext';
import { UserInfoContext } from '../../../../../../context/UserInfoContext';
import { UserInfo } from '../../../../../../interface/user';
import history from '../../../../../../router/history';
import ThirdStep from '../ThirdStep';

jest.mock('axios');
jest.mock('little-state-machine', () => ({
  useStateMachine: jest.fn(() => ({
    action: jest.fn(),
    state: {
      company: 'company-test',
      companyField: 'companyField-test',
      firstName: 'firstName-test',
      lastName: 'lastName-test',
      username: 'username-test',
      affiliation: 'affiliation-test',
      language: 'language-test',
      confirmEmailUrl: 'confirmEmailUrl-test',
    },
  })),
  createStore: jest.fn(),
}));

const render = (ui: React.ReactNode) =>
  rtlRender(
    <UserInfoContext.Provider value={{ userInfo: {}, setUserInfo: jest.fn() }}>
      <LocalContext.Provider value={{ local: 'en', setLocal: jest.fn() }}>{ui}</LocalContext.Provider>
    </UserInfoContext.Provider>,
  );

test('It should validate the form', async () => {
  const setErrorRegisterUser = jest.fn();
  const registerUser = jest.fn(
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    () => new Promise<UserInfo>((resolve) => resolve({ _id: 123456789 })),
  );
  const passwordValue = 'Azerty91!';
  history.push = jest.fn();

  const { getByTestId, getByLabelText } = render(
    <Router history={history}>
      <ThirdStep
        previousStep={() => {}}
        registerUser={registerUser}
        registerUserPending={false}
        setErrorRegisterUser={setErrorRegisterUser}
      />
    </Router>,
  );

  const submitBtn = getByTestId(/submit-testid/i);

  const passwordInput = getByLabelText(/register-password/i);
  const confirmPasswordInput = getByLabelText(/register-confirm-password/i);
  const generalConditionInput = getByTestId(/agreeTermsConditions-test/i);
  const privacyInformationInput = getByTestId(/agreePrivacyPolicy-test/i);
  const newProductInput = getByTestId(/personalDataProcessing-test/i);

  fireEvent.change(passwordInput, { target: { value: passwordValue } });
  fireEvent.change(confirmPasswordInput, { target: { value: passwordValue } });
  fireEvent.click(generalConditionInput);
  fireEvent.click(privacyInformationInput);
  fireEvent.click(newProductInput);

  fireEvent.click(submitBtn);

  await waitFor(() =>
    expect(registerUser).toHaveBeenCalledWith({
      data: {
        confirmEmailUrl: 'http://localhost:3000/confirmEmail',
        language: 'en',
        password: 'Azerty91!',
        affiliation: 'affiliation-test',
        firstName: 'firstName-test',
        lastName: 'lastName-test',
        username: 'username-test',
        company: 'company-test',
        companyField: 'companyField-test',
        preferences: {
          agreePrivacyPolicy: true,
          agreeTermsConditions: true,
          personalDataProcessing: true,
        },
      },
    }),
  );
  expect(setErrorRegisterUser).toHaveBeenCalledTimes(1);
  expect(history.push).toHaveBeenCalledWith('/confirmEmail?userid=123456789');
});

test('It should show an error when the request failed', async () => {
  const setErrorRegisterUser = jest.fn();
  const errorCode = 451;
  const registerUser = jest.fn(
    // eslint-disable-next-line prefer-promise-reject-errors
    () => Promise.reject({ response: { status: errorCode } }),
  );
  const passwordValue = 'Azerty91!';

  const { getByTestId, getByLabelText } = render(
    <ThirdStep
      previousStep={() => {}}
      registerUser={registerUser}
      registerUserPending={false}
      setErrorRegisterUser={setErrorRegisterUser}
    />,
  );

  const submitBtn = getByTestId(/submit-testid/i);

  const passwordInput = getByLabelText(/register-password/i);
  const confirmPasswordInput = getByLabelText(/register-confirm-password/i);
  const generalConditionInput = getByTestId(/agreeTermsConditions-test/i);
  const privacyInformationInput = getByTestId(/agreePrivacyPolicy-test/i);
  const newProductInput = getByTestId(/personalDataProcessing-test/i);

  fireEvent.change(passwordInput, { target: { value: passwordValue } });
  fireEvent.change(confirmPasswordInput, { target: { value: passwordValue } });
  fireEvent.click(generalConditionInput);
  fireEvent.click(privacyInformationInput);
  fireEvent.click(newProductInput);

  fireEvent.click(submitBtn);

  await waitFor(() =>
    expect(registerUser).toHaveBeenCalledWith({
      data: {
        confirmEmailUrl: 'http://localhost:3000/confirmEmail',
        language: 'en',
        password: 'Azerty91!',
        affiliation: 'affiliation-test',
        firstName: 'firstName-test',
        lastName: 'lastName-test',
        username: 'username-test',
        company: 'company-test',
        companyField: 'companyField-test',
        preferences: {
          agreePrivacyPolicy: true,
          agreeTermsConditions: true,
          personalDataProcessing: true,
        },
      },
    }),
  );
  expect(setErrorRegisterUser).toHaveBeenCalledWith(errorCode);
});

test('It should display error field', async () => {
  const registerUser = jest.fn().mockImplementationOnce(() => new Promise((resolve) => resolve()));

  const { getByTestId, getAllByTestId } = render(
    <ThirdStep
      previousStep={() => {}}
      registerUser={registerUser}
      registerUserPending={false}
      setErrorRegisterUser={() => {}}
    />,
  );

  const submitBtn = getByTestId(/submit-testid/i);

  fireEvent.click(submitBtn);

  await waitFor(() => expect(getAllByTestId(/inputError/i)).toHaveLength(2));
});

test('It should display error field for no match password', async () => {
  const registerUser = jest.fn().mockImplementationOnce(() => new Promise((resolve) => resolve()));

  const { getByTestId, getByLabelText } = render(
    <ThirdStep
      previousStep={() => {}}
      registerUser={registerUser}
      registerUserPending={false}
      setErrorRegisterUser={() => {}}
    />,
  );

  const passwordInput = getByLabelText(/register-password/i);
  const confirmPasswordInput = getByLabelText(/register-confirm-password/i);
  const passwordValue = 'Azerty91!';

  fireEvent.change(passwordInput, { target: { value: passwordValue } });
  fireEvent.change(confirmPasswordInput, { target: { value: `2-${passwordValue}` } });

  const submitBtn = getByTestId(/submit-testid/i);

  fireEvent.click(submitBtn);

  await waitFor(() => expect(getByTestId(/inputError/i)).toBeInTheDocument());
});

test('It should display bad format message', async () => {
  const registerUser = jest.fn().mockImplementationOnce(() => new Promise((resolve) => resolve()));

  const { getByTestId, getByText, getByLabelText } = render(
    <ThirdStep
      previousStep={() => {}}
      registerUser={registerUser}
      registerUserPending={false}
      setErrorRegisterUser={() => {}}
    />,
  );

  const passwordInput = getByLabelText(/register-password/i);
  const confirmPasswordInput = getByLabelText(/register-confirm-password/i);
  const badFormatPsw = 'Azer';

  fireEvent.change(passwordInput, { target: { value: badFormatPsw } });
  fireEvent.change(confirmPasswordInput, { target: { value: badFormatPsw } });

  const submitBtn = getByTestId(/submit-testid/i);

  fireEvent.click(submitBtn);

  await waitFor(() => expect(getByText(/global-password-check/i)).toBeInTheDocument());
});

test('It should display too long password', async () => {
  const registerUser = jest.fn().mockImplementationOnce(() => new Promise((resolve) => resolve()));

  const { getByTestId, getByText, getByLabelText } = render(
    <ThirdStep
      previousStep={() => {}}
      registerUser={registerUser}
      registerUserPending={false}
      setErrorRegisterUser={() => {}}
    />,
  );

  const passwordInput = getByLabelText(/register-password/i);
  const confirmPasswordInput = getByLabelText(/register-confirm-password/i);
  const longPassword = 'Azerty91!unmdpavecplusde16characteres';

  fireEvent.change(passwordInput, { target: { value: longPassword } });
  fireEvent.change(confirmPasswordInput, { target: { value: longPassword } });

  const submitBtn = getByTestId(/submit-testid/i);

  fireEvent.click(submitBtn);
  await waitFor(() => expect(getByText(/global-password-check-max/i)).toBeInTheDocument());
});

test('It should back to previous step when click back button', () => {
  const previousStep = jest.fn();
  const registerUser = jest.fn().mockImplementationOnce(() => new Promise((resolve) => resolve()));

  const { getByText } = render(
    <ThirdStep
      previousStep={previousStep}
      registerUser={registerUser}
      registerUserPending={false}
      setErrorRegisterUser={() => {}}
    />,
  );

  const backBtn = getByText(/global-previous/i);

  fireEvent.click(backBtn);

  expect(previousStep).toHaveBeenCalled();
});

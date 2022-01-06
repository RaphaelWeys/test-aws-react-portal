import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';

import SecondStep from '../SecondStep';

jest.mock('axios');
jest.mock('little-state-machine', () => ({
  useStateMachine: jest.fn(() => ({ action: jest.fn(), state: {} })),
}));

test('It should validate the form', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: { exists: false } });

  const nextStep = jest.fn();
  const { getByLabelText, getByTestId } = render(<SecondStep nextStep={nextStep} previousStep={() => {}} />);

  const submitBtn = getByTestId(/submit-testid/i);

  const firstNameInput = getByLabelText(/register-firstname/i);
  const lastNameInput = getByLabelText(/register-surname/i);
  const usernameInput = getByLabelText(/register-email/i);

  fireEvent.change(firstNameInput, { target: { value: 'firstname-test' } });
  fireEvent.change(lastNameInput, { target: { value: 'lastname-test' } });
  fireEvent.change(usernameInput, { target: { value: 'e@e.com' } });

  fireEvent.click(submitBtn);

  await waitFor(() => expect(nextStep).toHaveBeenCalled());
});

test('It should display error field', async () => {
  const { getByTestId, getAllByTestId } = render(<SecondStep nextStep={() => {}} previousStep={() => {}} />);

  const submitBtn = getByTestId(/submit-testid/i);

  fireEvent.click(submitBtn);

  await waitFor(() => expect(getAllByTestId(/inputError/i)).toHaveLength(3));
});

test('It should inform this email address is already used', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: { exists: true } });
  const { getByTestId, getByLabelText, getByText } = render(<SecondStep nextStep={() => {}} previousStep={() => {}} />);

  const submitBtn = getByTestId(/submit-testid/i);

  const firstNameInput = getByLabelText(/register-firstname/i);
  const lastNameInput = getByLabelText(/register-surname/i);
  const usernameInput = getByLabelText(/register-email/i);

  fireEvent.change(firstNameInput, { target: { value: 'firstname-test' } });
  fireEvent.change(lastNameInput, { target: { value: 'lastname-test' } });
  fireEvent.change(usernameInput, { target: { value: 'e@e.com' } });

  fireEvent.click(submitBtn);

  await waitFor(() => expect(getByText(/register-surname-failed/)).toBeInTheDocument());
});

test('It should back to previous step when click back button', () => {
  const previousStep = jest.fn();
  const { getByText } = render(<SecondStep nextStep={() => {}} previousStep={previousStep} />);

  const backBtn = getByText(/global-previous/i);

  fireEvent.click(backBtn);

  expect(previousStep).toHaveBeenCalled();
});

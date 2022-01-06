import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';

import FirstStep from '../FirstStep';

jest.mock('little-state-machine', () => ({
  useStateMachine: jest.fn(() => ({ action: jest.fn(), state: {} })),
}));

test('It should validate the form', async () => {
  const nextStep = jest.fn();
  const { getByLabelText, getByTestId } = render(<FirstStep nextStep={nextStep} />);

  const submitBtn = getByTestId(/submit-testid/i);

  const societyInput = getByLabelText(/register-society/i);
  const sectorInput = getByLabelText(/register-sector/i);
  fireEvent.change(societyInput, { target: { value: 'society-test' } });
  fireEvent.change(sectorInput, { target: { value: 'sector-test' } });

  fireEvent.click(submitBtn);

  await waitFor(() => expect(nextStep).toHaveBeenCalled());
});

test('It should display error field', async () => {
  const { getByTestId, getAllByTestId } = render(<FirstStep nextStep={() => {}} />);

  const submitBtn = getByTestId(/submit-testid/i);

  fireEvent.click(submitBtn);

  await waitFor(() => expect(getAllByTestId(/inputError/i)).toHaveLength(2));
});

test('It should back to previous step when click back button', () => {
  const previousStep = jest.fn();
  const { getByText } = render(<FirstStep nextStep={() => {}} />);

  const backBtn = getByText(/global-previous/i);

  fireEvent.click(backBtn);

  expect(previousStep).toHaveBeenCalled();
});

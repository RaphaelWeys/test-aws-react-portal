import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';

import ForgotPasswordModal from '../ForgotPasswordModal';
import useGetPortalApp from '../../../../../hooks/useGetPortalApp';

jest.mock('axios');

test('It should execute the request to send email then show a button to get back to home page', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({ data: {} });
  const portalAppUrl = useGetPortalApp();
  const emailValue = 'e@e.com';
  const mockSetVisible = jest.fn();
  const { getByLabelText, getByText } = render(<ForgotPasswordModal toggleModal={() => {}} />);

  const inputEmail = getByLabelText(/forgot-password-email/i);
  const submitBtn = getByText(/global-send/i);

  fireEvent.change(inputEmail, { target: { value: emailValue } });

  fireEvent.click(submitBtn);

  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: { resetUrl: `${portalAppUrl}/reset-password`, username: emailValue },
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      url: '/users/forgotPassword',
    }),
  );

  expect(getByText(/forgot-password-email-found/i)).toBeInTheDocument();
  const closeBtn = getByText(/global-close/i);
  fireEvent.click(closeBtn);
  expect(mockSetVisible).toHaveBeenCalledWith(false);
});

test('If email was not found, it should show error, then writing valid input and make the error go away ', async () => {
  (axios.request as jest.Mock).mockRejectedValueOnce({});

  const emailValue = 'e@e.com';
  const { getByLabelText, getByText, queryByText } = render(<ForgotPasswordModal toggleModal={() => {}} />);

  const inputEmail = getByLabelText(/forgot-password-email/i);
  const submitBtn = getByText(/global-send/i);

  fireEvent.change(inputEmail, { target: { value: emailValue } });

  fireEvent.click(submitBtn);

  await waitFor(() => expect(getByText(/forgot-password-email-not-found/i)).toBeInTheDocument());

  (axios.request as jest.Mock).mockResolvedValueOnce({});

  fireEvent.click(submitBtn);

  await waitFor(() => expect(queryByText(/forgot-password-email-not-found/i)).toBeNull());
});

test('It should show an error if not input is missing', async () => {
  const { getByText } = render(<ForgotPasswordModal toggleModal={() => {}} />);

  const submitBtn = getByText(/global-send/i);

  fireEvent.click(submitBtn);
  await waitFor(() => expect(getByText(/global-field-required/i)).toBeInTheDocument());
});

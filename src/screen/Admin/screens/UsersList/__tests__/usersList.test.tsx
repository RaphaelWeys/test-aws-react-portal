import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';

import UsersList from '../UsersList';

jest.mock('axios');

test('It should show a list of users', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      {
        id: 0,
        firstName: 'mav',
        lastName: 'test',
        company: 'company-test',
        username: 'fake-email@gmail.com',
        role: 'role-test',
        demo: true,
        createdDate: new Date(),
      },
    ],
  });
  const { getByTestId, getByText } = render(<UsersList />);

  const loader = getByTestId(/loader/i);

  await waitFor(() => expect(loader).toBeInTheDocument());

  expect(getByText(/company-test/i)).toBeInTheDocument();
});

test('It should show modal when double clicking a row', async () => {
  (axios.request as jest.Mock).mockResolvedValueOnce({
    data: [
      {
        id: 123456789,
        firstName: 'mav',
        lastName: 'test',
        company: 'company-test',
        username: 'fake-email@gmail.com',
        role: 'role-test',
        demo: true,
        createdDate: new Date(),
      },
    ],
  });

  const { getByTestId, getByText, getByLabelText } = render(<UsersList />);

  const loader = getByTestId(/loader/i);

  await waitFor(() => expect(loader).toBeInTheDocument());

  const firstName = 'test-firstName';

  const cellCompany = getByText(/company-test/i);
  expect(cellCompany).toBeInTheDocument();

  (axios.request as jest.Mock).mockResolvedValueOnce({
    data: {
      firstName,
      lastName: 'test-lastName',
      company: 'test-company',
      companyField: 'test-companyField',
      username: 'test-username',
    },
  });
  fireEvent.dblClick(cellCompany);

  await waitFor(() => expect(getByLabelText('modal-edit-user-input-firstname')).toBeInTheDocument());
  const inputFirstName = getByLabelText('modal-edit-user-input-firstname') as HTMLInputElement;

  expect(inputFirstName.value).toEqual(firstName);
});

test('It should delete an user', async () => {
  const companyTest = 'company-test';

  (axios.request as jest.Mock).mockResolvedValueOnce({
    data: [
      {
        id: 123456789,
        firstName: 'mav',
        lastName: 'test',
        company: companyTest,
        username: 'fake-email@gmail.com',
        role: 'role-test',
        demo: true,
        createdDate: new Date(),
      },
    ],
  });

  const { getByTestId, getByText, getByLabelText, queryByText } = render(<UsersList />);

  const loader = getByTestId(/loader/i);

  await waitFor(() => expect(loader).toBeInTheDocument());

  const cellCompany = getByText(/company-test/i);
  expect(cellCompany).toBeInTheDocument();

  (axios.request as jest.Mock).mockResolvedValueOnce({
    data: {
      firstName: 'test-firstName',
      lastName: 'test-lastName',
      company: 'test-company',
      companyField: 'test-companyField',
      username: 'test-username',
    },
  });
  fireEvent.dblClick(cellCompany);

  await waitFor(() => expect(getByLabelText('modal-edit-user-input-firstname')).toBeInTheDocument());
  (axios.request as jest.Mock).mockResolvedValueOnce({
    data: {},
  });

  // debug(getByText(/modal-edit-user-delete/i));
  fireEvent.click(getByText(/modal-edit-user-delete/i));

  await waitFor(() => expect(queryByText(companyTest)).toBeNull());
});

test('It should close the modal', async () => {});

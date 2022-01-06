import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import axios from 'axios';
import moment from 'moment';

import CouponList from '../CouponList';

jest.mock('axios');

afterEach(() => {
  (axios.request as jest.Mock).mockClear();
});

test('If request is pending, It should show loader', async () => {
  (axios.request as jest.Mock).mockResolvedValue({ data: [] });
  const { getByTestId } = render(<CouponList />);

  expect(getByTestId(/loader/i)).toBeInTheDocument();
  await waitFor(() => {});
});

test('The table should have the correct columns', async () => {
  (axios.request as jest.Mock).mockResolvedValue({ data: [] });
  const { getByText } = render(<CouponList />);

  await waitFor(() => {});

  expect(getByText(/code/i)).toBeInTheDocument();
  expect(getByText(/app/i)).toBeInTheDocument();
  expect(getByText(/value/i)).toBeInTheDocument();
  expect(getByText(/user/i)).toBeInTheDocument();
  expect(getByText(/date/i)).toBeInTheDocument();
  expect(getByText(/multiple/i)).toBeInTheDocument();
});

test('It should able to filter code column', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      { id: 1, code: 'this is code 1', app: '', value: '', user: '', date: '', multiple: '', order: '' },
      { id: 2, code: 'this is code 2', app: '', value: '', user: '', date: '', multiple: '', order: '' },
    ],
  });
  const { getByTestId, queryByText } = render(<CouponList />);

  await waitFor(() => expect(getByTestId(/code-test/i)).toBeInTheDocument());

  const inputCodeTest = getByTestId(/code-test/i);

  fireEvent.change(inputCodeTest, { target: { value: '1' } });
  expect(queryByText(/this is code 2/i)).toBeNull();
});

test('It should able to filter app column', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      { id: 1, code: '0', app: 'tender', value: '', user: '', date: '', multiple: '', order: '' },
      { id: 2, code: '1', app: 'tender', value: '', user: '', date: '', multiple: '', order: '' },
    ],
  });
  const { getAllByText, getAllByRole, getByText } = render(<CouponList />);

  await waitFor(() => expect(getAllByText(/tender/i).length).toEqual(2));

  const selectInput = getAllByRole('combobox')[0];

  fireEvent.change(selectInput, { target: { value: 'random-value' } });
  fireEvent.click(getByText(/^Follow$/));

  expect(getByText(/no data/i)).toBeInTheDocument();
});

test('It should able to filter value column', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      { id: 1, code: '0', app: '', value: 'this is value 1', user: '', date: '', multiple: '', order: '' },
      { id: 2, code: '1', app: '', value: 'this is value 2', user: '', date: '', multiple: '', order: '' },
    ],
  });
  const { getByText, getByTestId, queryByText } = render(<CouponList />);

  await waitFor(() => expect(getByText(/this is value 2/i)).toBeInTheDocument());

  const inputCodeTest = getByTestId(/value-test/i);

  fireEvent.change(inputCodeTest, { target: { value: '1' } });

  expect(queryByText(/this is value 2/i)).toBeNull();
});

test('It should able to filter user column', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      {
        id: 1,
        code: '0',
        app: '',
        value: '',
        user: { firstName: 'mav', lastName: '1' },
        date: '',
        multiple: '',
        order: '',
      },
      {
        id: 2,
        code: '1',
        app: '',
        value: '',
        user: { firstName: 'mav', lastName: '2' },
        date: '',
        multiple: '',
        order: '',
      },
    ],
  });
  const { getByText, getByTestId, queryByText } = render(<CouponList />);

  await waitFor(() => expect(getByText(/mav 2/i)).toBeInTheDocument());

  const inputCodeTest = getByTestId(/user-test/i);

  fireEvent.change(inputCodeTest, { target: { value: '1' } });

  expect(queryByText(/mav 2/i)).toBeNull();
});

test('It should able to filter date column', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      {
        id: 2,
        code: '1',
        app: '',
        value: '',
        user: '',
        validityStart: '2022-06-15',
        validityEnd: '2022-09-15',
        multiple: '',
        order: '',
      },
    ],
  });
  const { getByText, getByTestId } = render(<CouponList />);

  await waitFor(() => expect(getByText('15-06-2022 / 15-09-2022')).toBeInTheDocument());

  const endDatePicker = getByTestId(/end-date-test/i);

  fireEvent.mouseDown(endDatePicker);
  fireEvent.click(getByText(/today/i));
  expect(getByText('No Data')).toBeInTheDocument();
});

test('It should display a new column', async () => {
  (axios.request as jest.Mock).mockResolvedValue({ data: [] });

  const { getByText, getAllByTestId } = render(<CouponList />);

  await waitFor(() => expect(getByText(/no data/i)).toBeInTheDocument());

  const addBtn = getByText('Add a coupon');

  fireEvent.click(addBtn);
  expect(getAllByTestId(/input-new-coupon/i)).toHaveLength(2);
});

test('It should create a new coupon', async () => {
  (axios.request as jest.Mock).mockResolvedValue({ data: [] });

  const { getByText, getAllByTestId, getByTestId, queryByText } = render(<CouponList />);

  await waitFor(() => expect(getByText(/no data/i)).toBeInTheDocument());

  const addBtn = getByText('Add a coupon');

  fireEvent.click(addBtn);
  expect(getAllByTestId(/input-new-coupon/i)).toHaveLength(2);

  const codeInput = getAllByTestId(/input-new-coupon/i)[0];
  const valueInput = getAllByTestId(/input-new-coupon/i)[1];
  const startDatePicker = getAllByTestId(/start-date-test/i)[1];
  const submitBtn = getByTestId(/submit-btn/i);

  fireEvent.change(codeInput, { target: { value: 'code-test' } });
  fireEvent.change(valueInput, { target: { value: 'code-test' } });
  fireEvent.mouseDown(startDatePicker);
  fireEvent.click(getByText(/today/i));
  fireEvent.click(submitBtn);

  (axios.request as jest.Mock).mockResolvedValue({
    data: {
      app: 'tender',
      code: 'q',
      createdAt: '2020-07-13T09:26:33.878Z',
      id: '5f0c28c9ebeb48000428c81a',
      multipleUsage: true,
      orders: [],
      updatedAt: '2020-07-13T09:26:33.878Z',
      validityStart: '2020-07-13',
      value: 2,
    },
  });

  await waitFor(() => expect(queryByText(/no data/i)).toBeNull());
});

test('It should delete coupon', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      { id: 1, code: '0', app: 'lol', value: 'this is value 1', user: 'mo', date: '', multiple: 'true', order: '' },
    ],
  });

  const { getByText, getAllByTestId, queryByText } = render(<CouponList />);

  await waitFor(() => expect(getByText(/this is value 1/i)).toBeInTheDocument());

  const deleteIcon = getAllByTestId(/delete-icon/i)[0];

  fireEvent.click(deleteIcon);

  const popconfirm = getByText(/yes/i);

  (axios.request as jest.Mock).mockResolvedValue({ data: {} });

  fireEvent.click(popconfirm);

  await waitFor(() => expect(queryByText(/no data/i)).toBeInTheDocument());
});

test('It should edit coupon', async () => {
  (axios.request as jest.Mock).mockResolvedValue({
    data: [{ id: 1, code: 'random-code', app: 'follow', value: '10', user: '', date: '', multiple: true, order: '' }],
  });
  const { getByText, getByTestId, getAllByTestId } = render(<CouponList />);

  await waitFor(() => expect(getByText(/follow/i)).toBeInTheDocument());

  const editIcon = getAllByTestId(/edit-icon/i)[0];

  fireEvent.click(editIcon);

  await waitFor(() => expect(getAllByTestId(/input-new-coupon/i)).toHaveLength(1));

  const valueInput = getAllByTestId(/input-new-coupon/i)[0];
  const startDatePicker = getAllByTestId(/start-date-test/i)[1];
  const submitBtn = getByTestId(/submit-btn/i);

  fireEvent.change(valueInput, { target: { value: '123' } });
  fireEvent.mouseDown(startDatePicker);
  fireEvent.click(getByText(/today/i));

  (axios.request as jest.Mock).mockClear();

  (axios.request as jest.Mock).mockResolvedValue({
    data: {
      id: 1,
      code: 'edited-code-test',
      app: 'tender',
      value: '10',
      user: '',
      date: '',
      multiple: false,
      order: '',
    },
  });

  fireEvent.click(submitBtn);
  await waitFor(() =>
    expect(axios.request).toHaveBeenCalledWith({
      data: {
        app: 'follow',
        code: 'RANDOM-CODE',
        user: null,
        multipleUsage: false,
        validityEnd: null,
        validityStart: moment().format('YYYY-MM-DD'),
        value: 123,
      },
      headers: { 'Content-Type': 'application/json' },
      method: 'put',
      url: '/coupon/admin/update/1',
    }),
  );

  await waitFor(() => expect(getByText(/edited-code-test/i)).toBeInTheDocument());
});

test('It should display the order table', async () => {
  const purpose = 'this is a random purpose';
  (axios.request as jest.Mock).mockResolvedValue({
    data: [
      {
        id: 1,
        key: 0,
        code: '0',
        app: 'follow',
        value: '10',
        user: '',
        date: '',
        multiple: true,
        orders: [
          {
            order: {
              _id: '5efc8607630dbc0004a7a785',
              name: 'Nicolas Henny',
              product: 'rfo-gas-200-500',
              app: 'tender',
              purpose,
              reference: 'GAS-18499',
              id: '5efc8607630dbc0004a7a785',
            },
            user: {
              _id: '5ed9fe2f25c5cb000422bdc4',
              company: 'YEM',
              firstName: 'Nicolas',
              lastName: 'Henny',
              username: 'nicolas.Henny@yem-energy.com',
              id: '5ed9fe2f25c5cb000422bdc4',
            },
            date: '2020-07-08',
            amount: 123.5,
          },
        ],
      },
    ],
  });
  const { getByTestId, getByText } = render(<CouponList />);

  await waitFor(() => expect(getByText(/follow/i)).toBeInTheDocument());

  fireEvent.click(getByTestId('expand-icon'));
  expect(getByText(purpose)).toBeInTheDocument();
  expect(getByTestId(/table-expanded/i)).toBeInTheDocument();
});

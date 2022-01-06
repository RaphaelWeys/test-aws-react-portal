import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';

export const useUpdateTermAndCondition = () => {
  const client = useApi();

  return useMutation<void, AxiosError<void>, string>(
    (token) =>
      client
        .post('/users/multi-access/conditionsAcceptedByClient', null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data),
    {
      onError() {
        message.error('There was a problem during the validation');
      },
    },
  );
};

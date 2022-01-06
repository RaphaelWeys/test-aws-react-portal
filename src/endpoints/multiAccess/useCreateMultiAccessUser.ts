import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { message } from 'antd';

export const useCreateMultiAccessUser = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<{}, AxiosError<{}>, any>(
    (values) => client.post('/users/multi-access/create', values).then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('get-multi-access-users');
      },
      onError() {
        message.error('Request failed to create the user');
      },
    },
  );
};

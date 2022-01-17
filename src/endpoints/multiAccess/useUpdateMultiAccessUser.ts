import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../context/ApiContext';

export const useUpdateMultiAccessUser = (userId) => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<{}, AxiosError<{}>, any>(
    (values) => client.put(`/users/multi-access/${userId}`, values).then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries(['get-multi-access-kam-info', userId]);
        queryClient.invalidateQueries(['get-multi-access-users', userId]);
        queryClient.invalidateQueries('get-kam-contract-list');
      },
      onError() {
        message.error('Request failed to update the user');
      },
    },
  );
};

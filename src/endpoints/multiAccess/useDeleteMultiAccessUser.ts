import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useTenant } from '../../context/TenantContext';

export const useDeleteMultiAccessUser = () => {
  const client = useApi();
  const queryClient = useQueryClient();
  const { env } = useTenant();

  return useMutation<{}, AxiosError<{}>, { id: string }>(
    (payload) =>
      client.post(`${env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/user/deleteUser`, payload).then((res) => res.data),
    {
      onSuccess(data) {
        queryClient.setQueryData(['get-multi-access-users'], data);
      },
      onError() {
        message.error('Request failed to delete the user');
      },
    },
  );
};

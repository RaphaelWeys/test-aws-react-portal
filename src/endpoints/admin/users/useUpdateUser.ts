import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { UserInfo } from '../../../interface/user';

type TValues = UserInfo;

interface TContext {
  users: UserInfo[];
}

export const useUpdateUser = (userId = '') => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<UserInfo, AxiosError<UserInfo>, TValues, TContext>(
    (data) => client.put(`/users/admin/update/${userId}`, data).then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('get-users');
      },
      onError() {
        message.error('Cannot update user info');
      },
    },
  );
};

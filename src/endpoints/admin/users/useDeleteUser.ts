import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { UserInfo } from '../../../interface/user';

type TContext = { users: UserInfo[] };

export const useDeleteUser = (userId = '') => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<void>, null, TContext>(
    () => client.delete(`/users/admin/delete/${userId}`).then((res) => res.data),
    {
      onMutate() {
        const users = queryClient.getQueryData('get-users') as UserInfo[];
        const newUsers = users.filter((user) => user.id !== userId);

        queryClient.setQueryData('get-users', newUsers);
        return { users };
      },
      onError(error, _, context) {
        if (context) queryClient.setQueryData('get-users', context.users);

        message.error('Cannot delete this user');
      },
    },
  );
};

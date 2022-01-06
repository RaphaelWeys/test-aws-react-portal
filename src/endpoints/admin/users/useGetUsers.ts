import { AxiosError } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { UserInfo } from '../../../interface/user';

export const useGetUsers = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useQuery<UserInfo[], AxiosError<UserInfo[]>>(
    'get-users',
    () => client.get('/users/admin/all').then((res) => res.data),
    {
      onSuccess(data) {
        data.map((user) => queryClient.setQueryData(['get-users', user.id], user));
      },
    },
  );
};

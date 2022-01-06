import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { UserInfoLight } from '../../../interface/user';

export const useGetUserList = () => {
  const client = useApi();

  return useQuery<UserInfoLight[], AxiosError<UserInfoLight[]>>('get-user-list', () =>
    client.get('/users/admin/list').then((res) => res.data),
  );
};

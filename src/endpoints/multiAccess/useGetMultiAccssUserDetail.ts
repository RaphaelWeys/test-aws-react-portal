import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { MultiAccessClient } from '../../interface/multiAccess';
import { message } from 'antd';

export const useGetMultiAccessUserDetail = (userId) => {
  const client = useApi();

  return useQuery<MultiAccessClient, AxiosError<MultiAccessClient>>(
    ['get-multi-access-users', userId],
    () => client.get(`/users/multi-access/${userId}`).then((res) => res.data),
    {
      onError() {
        message.error('Cannot get this user');
      },
    },
  );
};

import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { message } from 'antd';

import { useApi } from '../../context/ApiContext';
import { MultiAccess } from '../../interface/multiAccess';

export const useGetMultiAccessList = () => {
  const client = useApi();

  return useQuery<MultiAccess, AxiosError<MultiAccess>>(
    'get-multi-access-users',
    () => client.get('/users/multi-access/list').then((res) => res.data),
    {
      onError() {
        message.error('Request failed to get the list');
      },
    },
  );
};

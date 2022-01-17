import { message } from 'antd';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { MultiAccess } from '../../interface/multiAccess';

export const useGetMultiAccessList = (kamGroupId = '0', enabled = true) => {
  const client = useApi();

  return useQuery<MultiAccess, AxiosError<MultiAccess>>(
    'get-multi-access-users',
    () =>
      client
        .get(`/users/multi-access/list${kamGroupId === '0' ? '' : `?kamGroup=${kamGroupId}`}`)
        .then((res) => res.data),
    {
      onError() {
        message.error('Request failed to get the list');
      },
      enabled,
    },
  );
};

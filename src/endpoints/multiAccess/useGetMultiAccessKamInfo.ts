import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { message } from 'antd';
import { KamInfo } from '../../interface/kamInfo';

export const useGetMultiAccessKamInfo = (userId) => {
  const client = useApi();

  return useQuery<KamInfo, AxiosError<KamInfo>>(
    ['get-multi-access-kam-info', userId],
    () =>
      client
        .get(`${process.env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/manager/kamInfo/${userId}`)
        .then((res) => res.data),
    {
      onError() {
        message.error('Cannot get kam info');
      },
    },
  );
};

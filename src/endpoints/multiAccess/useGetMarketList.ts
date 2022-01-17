import { message } from 'antd';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { MarketList } from '../../interface/marketList';

export const useGetMarketList = () => {
  const client = useApi();

  return useQuery<MarketList[], AxiosError<MarketList[]>>(
    'get-market-list',
    () =>
      client.get(`${process.env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/manager/marketList`).then((res) => res.data),
    {
      onError() {
        message.error('Request failed to get the list');
      },
    },
  );
};

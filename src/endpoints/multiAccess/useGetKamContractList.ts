import { message } from 'antd';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { MultiAccessKamContractList } from '../../interface/kamContractList';

export const useGetKamContractList = (userId: string) => {
  const client = useApi();

  return useQuery<MultiAccessKamContractList[], AxiosError<MultiAccessKamContractList[]>>(
    'get-kam-contract-list',
    () =>
      client
        .get(`${process.env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/kam/contractsListForClient/${userId}`)
        .then((res) => res.data),
    {
      onError() {
        message.error('Cannot get the contract list');
      },
    },
  );
};

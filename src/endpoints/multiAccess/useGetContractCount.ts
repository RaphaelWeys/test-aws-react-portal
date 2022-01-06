import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { message } from 'antd';

import { useApi } from '../../context/ApiContext';

interface ContractCount {
  contracts: number;
  userId: string;
}
export const useGetContractCount = () => {
  const client = useApi();

  return useQuery<ContractCount[], AxiosError<ContractCount[]>>(
    'get-contract-count',
    () => client.get(`${process.env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/contract/count`).then((res) => res.data),
    {
      onError() {
        message.error('Request failed to get the contract count');
      },
    },
  );
};

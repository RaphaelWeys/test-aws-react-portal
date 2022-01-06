import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useTenant } from '../../context/TenantContext';

interface TransfersAccount {
  firstName: string;
  id: string;
  lastName: string;
}

export const useGetKamListForKam = () => {
  const client = useApi();
  const { env } = useTenant();

  return useQuery<TransfersAccount[], AxiosError<TransfersAccount[]>>('get-list-transfers-account', () =>
    client.get(`${env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/kam/kamList`).then((res) => res.data),
  );
};

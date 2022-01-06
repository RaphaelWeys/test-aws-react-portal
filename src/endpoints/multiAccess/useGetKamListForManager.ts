import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useTenant } from '../../context/TenantContext';

interface KamListForManager {
  firstName: string;
  id: string;
  lastName: string;
}

export const useGetKamListForManager = () => {
  const client = useApi();
  const { env } = useTenant();

  return useQuery<KamListForManager[], AxiosError<KamListForManager[]>>('get-kam-list', () =>
    client.get(`${env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/manager/kamList`).then((res) => res.data),
  );
};

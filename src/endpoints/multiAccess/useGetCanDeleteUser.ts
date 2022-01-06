import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { message } from 'antd';

import { useApi } from '../../context/ApiContext';

interface CanDeleteUser {
  canDelete: boolean;
  contracts: number;
  clients: number;
}

export const useGetCanDeleteUser = (userId: string) => {
  const client = useApi();

  return useQuery<CanDeleteUser, AxiosError<CanDeleteUser>>(
    'can-delete-user',
    () =>
      client
        .get(`${process.env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/user/canDeleteUser/${userId}`)
        .then((res) => res.data),
    {
      onError() {
        message.error('Request failed to check if the user can be deleted');
      },
    },
  );
};

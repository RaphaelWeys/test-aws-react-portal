import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { IUserAdmin } from '../../../interface/userAdmin';

export const useGetUser = (userId = '') => {
  const client = useApi();

  return useQuery<IUserAdmin, AxiosError<IUserAdmin>>(['get-users', userId], () =>
    client.get(`/users/admin/${userId}`).then((res) => res.data),
  );
};

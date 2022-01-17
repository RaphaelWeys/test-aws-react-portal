import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { GroupListKam } from '../../interface/group';

export const useGetGroupKam = () => {
  const client = useApi();

  return useQuery<GroupListKam[], AxiosError<GroupListKam[]>>('group-kam', () =>
    client.get('/users/multi-access/kamGroup/kams').then((res) => res.data),
  );
};

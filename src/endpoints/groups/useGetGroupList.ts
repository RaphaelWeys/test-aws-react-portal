import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { GroupList } from '../../interface/group';

export const useGetGroupList = () => {
  const client = useApi();

  return useQuery<GroupList[], AxiosError<GroupList[]>>('group-list', () =>
    client.get('/users/multi-access/kamGroup/list').then((res) => res.data),
  );
};

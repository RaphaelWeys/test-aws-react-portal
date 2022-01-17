import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { GroupDetails } from '../../interface/group';

export const useGetGroupDetails = (id: string) => {
  const client = useApi();

  return useQuery<GroupDetails, AxiosError<GroupDetails>>(['group-details', id], () =>
    client.get(`/users/multi-access/kamGroup/${id}`).then((res) => res.data),
  );
};

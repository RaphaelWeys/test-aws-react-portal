import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { GroupListKam } from '../../interface/group';

export const useCreateGroup = (isCreatingGroup = false, id = '') => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<GroupListKam[], AxiosError<GroupListKam[]>>(
    (payload) => {
      if (isCreatingGroup) return client.post('/users/multi-access/kamGroup', payload).then((res) => res.data);
      return client.put(`/users/multi-access/kamGroup/${id}`, payload).then((res) => res.data);
    },
    {
      onSuccess() {
        if (!isCreatingGroup) {
          queryClient.invalidateQueries(['group-details', id]);
        }
      },
    },
  );
};

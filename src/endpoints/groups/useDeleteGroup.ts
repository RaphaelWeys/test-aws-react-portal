import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../context/ApiContext';
import useCookie from '../../hooks/useCookie';

export const useDeleteGroup = (groupId: string) => {
  const client = useApi();
  const queryClient = useQueryClient();
  const { getCookie, removeCookie } = useCookie();

  return useMutation<{}, AxiosError<{}>>(
    () => client.delete(`/users/multi-access/kamGroup/${groupId}`).then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('group-list');
        const groupIdCookie = getCookie('groupId');

        if (groupId === groupIdCookie) {
          removeCookie('groupId');
        }
      },
      onError() {
        message.error('Request failed to delete the group');
      },
    },
  );
};

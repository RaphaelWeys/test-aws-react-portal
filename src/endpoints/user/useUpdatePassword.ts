import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';

interface TValues {
  currentPassword: string;
  newPassword: string;
}
export const useUpdatePassword = () => {
  const client = useApi();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, TValues>((data) =>
    client.post('/users/changePassword', data).then((res) => res.data),
  );
};

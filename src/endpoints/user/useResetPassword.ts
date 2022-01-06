import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';

interface TVariables {
  newPassword: string;
  token: string;
}

export const useResetPassword = () => {
  const client = useApi();

  return useMutation<{}, AxiosError<{}>, TVariables>(
    (values) => client.post('/users/resetPassword', values).then((res) => res.data),
    {
      onError() {
        message.error('Request failed to reset the password');
      },
    },
  );
};

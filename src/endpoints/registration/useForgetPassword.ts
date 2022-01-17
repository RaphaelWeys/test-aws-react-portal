import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import useGetPortalApp from '../../hooks/useGetPortalApp';

export interface FormForgotPasswordModal {
  username: string;
}

export const useForgotPassword = () => {
  const client = useApi();
  const portalAppUrl = useGetPortalApp();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, FormForgotPasswordModal>(
    ({ username }) =>
      client
        .post('/users/forgotPassword', { username, resetUrl: `${portalAppUrl}/reset-password` })
        .then((res) => res.data),
    {
      onError() {
        message.error('Request failed');
      },
    },
  );
};

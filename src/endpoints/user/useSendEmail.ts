import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import useGetPortalApp from '../../hooks/useGetPortalApp';

export const useSendEmail = () => {
  const client = useApi();
  const portalAppUrl = useGetPortalApp();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, string>(
    (userId) =>
      client
        .post('/users/sendValidationEmail', { userId, confirmEmailUrl: `${portalAppUrl}/confirmEmail` })
        .then((res) => res.data),
    {
      onSuccess() {
        message.success('E-mail sent');
      },
      onError() {
        message.error('Cannot sent email');
      },
    },
  );
};

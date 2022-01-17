import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useTenant } from '../../context/TenantContext';

export const useTransfersAccount = () => {
  const client = useApi();
  const { env } = useTenant();

  return useMutation<{}, AxiosError<{}>, any>(
    (values) =>
      client
        .post(`${env.REACT_APP_BACKEND_FOLLOW_URL}/multiaccess/kam/transferOneClientToAnotherKam`, values)
        .then((res) => res.data),
    {
      onError() {
        message.error('Request failed to transfers the account');
      },
    },
  );
};

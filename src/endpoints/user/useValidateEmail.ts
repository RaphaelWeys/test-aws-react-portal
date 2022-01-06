import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useUserInfo } from '../../context/UserInfoContext';
import { UserInfo } from '../../interface/user';
import { saveTokenCookies } from '../../utils';
import { useTenant } from '../../context/TenantContext';

export const useValidateEmail = (token: string) => {
  const client = useApi();
  const { setUserInfo } = useUserInfo();
  const { env } = useTenant();

  return useMutation<UserInfo, AxiosError<UserInfo>>(
    () => client.post('/users/validateEmail', { token }).then((res) => res.data),
    {
      onSuccess(data) {
        saveTokenCookies(data.token, env.REACT_APP_SUB_DOMAIN);
        setUserInfo(data);
      },
      onError(error) {
        if (error?.response?.status === 409) {
          message.error('This email is already validated');
        } else {
          message.error('Cannot validate the email');
        }
      },
    },
  );
};

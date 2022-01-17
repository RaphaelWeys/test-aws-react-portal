import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useUserInfo } from '../../context/UserInfoContext';
import useSaveToken from '../../hooks/useSaveToken';
import { UserInfo } from '../../interface/user';

export const useValidateEmail = (token: string) => {
  const client = useApi();
  const { setUserInfo } = useUserInfo();
  const { saveToken } = useSaveToken();

  return useMutation<UserInfo, AxiosError<UserInfo>>(
    () => client.post('/users/validateEmail', { token }).then((res) => res.data),
    {
      onSuccess(data) {
        saveToken(data.token);
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

import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { UserInfo } from '../../interface/user';
import { FormLogin } from '../../screen/Login/Login.interface';

type Payload = FormLogin & { tenant?: string };

export const useLogin = () => {
  const client = useApi();

  return useMutation<UserInfo, AxiosError<UserInfo>, Payload>((data) =>
    client.post('/users/authenticate', { ...data }).then((res) => res.data),
  );
};

import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { useApi } from '../../context/ApiContext';
import { UserInfo } from '../../interface/user';
import { FormLogin } from '../../screen/Login/Login';

export const useLogin = () => {
  const client = useApi();

  return useMutation<UserInfo, AxiosError<UserInfo>, FormLogin>((data) =>
    client.post('/users/authenticate', { ...data }).then((res) => res.data),
  );
};

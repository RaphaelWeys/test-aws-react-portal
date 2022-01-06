import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { CheckUsername } from '../../interface/username';

export const useCheckUsername = () => {
  const client = useApi();

  return useMutation<CheckUsername, AxiosError<CheckUsername>, string>((username) =>
    client.post('/users/checkUsername', { username }).then((res) => res.data),
  );
};

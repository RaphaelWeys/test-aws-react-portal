import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../context/ApiContext';
import { useUserInfo } from '../../context/UserInfoContext';

export const useUpdateLanguage = () => {
  const client = useApi();
  const { setUserInfo } = useUserInfo();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, string>(
    (language) => client.post('/users/setLanguage', { language }).then((res) => res.data),
    {
      onMutate(language) {
        setUserInfo((ui) => ({ ...ui, language }));
      },
    },
  );
};

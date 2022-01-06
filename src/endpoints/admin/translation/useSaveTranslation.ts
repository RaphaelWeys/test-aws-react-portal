import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import enLocal from '../../../lang/en.json';
import itLocal from '../../../lang/it.json';

export const useSaveTranslation = () => {
  const client = useApi();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>>(
    () => client.post('/config/admin/app-resources/portal', { en: enLocal, it: itLocal }).then((res) => res.data),
    {
      onError() {
        message.error('Request failed to save the translations');
      },
    },
  );
};

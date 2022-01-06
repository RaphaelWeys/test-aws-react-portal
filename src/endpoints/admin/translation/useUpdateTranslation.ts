import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Translation } from './useGetTranslations';

interface TVariables {
  key: string;
  text: string;
}

type TContext = { currentTranslation: Translation[] };

export const useUpdateTranslation = (app: string, lang: string) => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, TVariables, TContext>(
    (values) => client.put(`config/admin/update-app-locales/${app}/${lang}`, values).then((res) => res.data),
    {
      onMutate({ key, text }) {
        const currentTranslation = queryClient.getQueryData(['get-translations', app, lang]) as Translation[];

        const newTranslation = currentTranslation.map((item) => (item.key === key ? { ...item, custom: text } : item));
        queryClient.setQueryData(['get-translations', app, lang], newTranslation);

        return { currentTranslation };
      },
      onSuccess() {
        message.success('Translation updated');
      },
      onError(error, _, context) {
        if (error && context) queryClient.setQueryData(['get-translations', app, lang], context.currentTranslation);
        message.error('Request failed to update the translation');
      },
    },
  );
};

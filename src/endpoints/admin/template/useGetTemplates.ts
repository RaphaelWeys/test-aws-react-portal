import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Template } from '../../../interface/template';

export const useGetTemplates = (app: string, lang: string) => {
  const client = useApi();

  return useQuery<Template[], AxiosError<Template[]>>(['get-templates', app, lang], () =>
    client.get(`/template/templatesList/${app}/${lang}`).then((res) => res.data),
  );
};

import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';

export const useGetTemplateRaw = (templateId?: string) => {
  const client = useApi();

  return useQuery<string, AxiosError<string>>(
    ['get-template', templateId],
    () => client.get(`/template/content/${templateId}`).then((res) => res.data),
    { enabled: Boolean(templateId) },
  );
};

import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';

export const useGetSubject = (templateId?: string) => {
  const client = useApi();

  return useQuery<string, AxiosError<string>>(
    ['get-subject', templateId],
    () => client.get(`/template/subject/${templateId}`).then((res) => res.data),
    { enabled: Boolean(templateId) },
  );
};

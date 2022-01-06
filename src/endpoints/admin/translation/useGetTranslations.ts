import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';

export type Translation = {
  custom: string;
  english: string;
  key: string;
  local: string;
};

export const useGetTranslations = (app: string, lang: string) => {
  const client = useApi();

  return useQuery<Translation[], AxiosError<Translation[]>>(['get-translations', app, lang], () =>
    client.get(`config/app-combined-locales/${app}/${lang}`).then((res) => res.data),
  );
};

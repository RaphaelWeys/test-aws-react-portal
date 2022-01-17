import { message } from 'antd';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { ScoreResponse } from '../cerved';

export const useGetCerved = (codiceFiscale: string) => {
  const client = useApi();

  return useQuery<ScoreResponse, AxiosError<ScoreResponse>>(
    ['get-cerved', codiceFiscale],
    () =>
      client
        .get(`${process.env.REACT_APP_BACKEND_TENDER_URL}/rfo-operation/admin/company/score/${codiceFiscale}`)
        .then((res) => res.data),
    {
      enabled: false,
      onError() {
        message.error('Cannot get cerved');
      },
    },
  );
};

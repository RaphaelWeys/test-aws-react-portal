import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Rfo } from '../../../interface/rfo';

export const useGetRfos = (filter: string) => {
  const client = useApi();

  return useQuery<Rfo[], AxiosError<Rfo[]>>('get-rfos', () =>
    client.get(`${process.env.REACT_APP_BACKEND_TENDER_URL}/rfos/admin/${filter}`).then((res) => res.data),
  );
};

import { AxiosError } from 'axios';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Supplier } from '../../../interface/supplier';

export const useGetSuppliers = () => {
  const client = useApi();

  return useQuery<Supplier[], AxiosError<Supplier[]>>('get-suppliers', () =>
    client.get(`${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers`).then((res) => res.data),
  );
};

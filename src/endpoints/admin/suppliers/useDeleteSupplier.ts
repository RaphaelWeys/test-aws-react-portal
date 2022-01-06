import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Supplier } from '../../../interface/supplier';

type TContext = { suppliers: Supplier[] };

export const useDeleteSupplier = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<void>, string, TContext>(
    (supplierId) => {
      return client
        .delete(`${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers/${supplierId}`)
        .then((res) => res.data);
    },
    {
      onMutate(supplierId) {
        const suppliers = queryClient.getQueryData('get-suppliers') as Supplier[];
        const newSuppliers = suppliers.filter((supplier) => supplier.id !== supplierId);

        queryClient.setQueryData('get-suppliers', newSuppliers);
        return { suppliers };
      },
      onError(error, _, context) {
        if (context) queryClient.setQueryData('get-suppliers', context.suppliers);

        message.error('Cannot delete this supplier');
      },
    },
  );
};

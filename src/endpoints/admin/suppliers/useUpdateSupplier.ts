import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { FormData } from '../../../components/Modal/ModalEditSupplier/ModalEditSupplier.interface';
import { useApi } from '../../../context/ApiContext';
import { Supplier } from '../../../interface/supplier';

interface TValues extends FormData {
  greenMixDescription: string;
}

interface TContext {
  suppliers: Supplier[];
}

export const useUpdateSupplier = (supplierId = '') => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, TValues, TContext>(
    (data) =>
      client.put(`${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers/${supplierId}`, data).then((res) => res.data),
    {
      onMutate(supplier) {
        const suppliers = queryClient.getQueryData(['get-suppliers']) as Supplier[];
        const newSuppliers = suppliers.map((item) => (item.id === supplierId ? supplier : item));
        queryClient.setQueryData('get-suppliers', newSuppliers);

        return { suppliers };
      },
      onSuccess() {
        queryClient.invalidateQueries('get-suppliers');
      },
      onError(error, _, context) {
        if (context) queryClient.setQueryData('get-suppliers', context.suppliers);

        message.error('Cannot update the supplier');
      },
    },
  );
};

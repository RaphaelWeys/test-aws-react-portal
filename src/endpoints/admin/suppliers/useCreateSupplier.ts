import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';

import { FormData } from '../../../components/Modal/ModalEditSupplier/ModalEditSupplier';
import { useApi } from '../../../context/ApiContext';
import { Supplier } from '../../../interface/supplier';

interface TValues extends FormData {
  greenMixDescription: string;
}

export const useCreateSupplier = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Supplier, AxiosError<Supplier>, TValues>(
    (data) => client.post(`${process.env.REACT_APP_BACKEND_TENDER_URL}/suppliers`, data).then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('get-suppliers');
      },
      onError() {
        message.error('Cannot create a supplier');
      },
    },
  );
};

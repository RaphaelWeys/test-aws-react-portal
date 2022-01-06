import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';

export const useGeneratePDF = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, string>(
    (rfoId) =>
      client
        .post(`${process.env.REACT_APP_BACKEND_TENDER_URL}/rfo-operation/admin/generatepdf/${rfoId}`)
        .then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('get-rfos');
      },
      onError() {
        message.error('Cannot generate the pdf');
      },
    },
  );
};

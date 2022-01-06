import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';

export const useValidateRfo = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Record<string, unknown>, AxiosError<Record<string, unknown>>, string>(
    (rfoId) =>
      client
        .post(`${process.env.REACT_APP_BACKEND_TENDER_URL}/rfo-operation/validated`, { id: rfoId })
        .then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('get-rfos');
      },
      onError() {
        message.error('Cannot validate the rfo');
      },
    },
  );
};

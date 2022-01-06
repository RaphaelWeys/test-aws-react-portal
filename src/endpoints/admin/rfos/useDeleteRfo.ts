import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Rfo } from '../../../interface/rfo';

type TContext = { rfos: Rfo[] };

export const useDeleteRfo = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<void>, string, TContext>(
    (rfoId) => client.delete(`${process.env.REACT_APP_BACKEND_TENDER_URL}/rfos/${rfoId}`).then((res) => res.data),
    {
      onMutate(rfoId) {
        const rfos = queryClient.getQueryData('get-rfos') as Rfo[];
        const newRfos = rfos.filter((rfo) => rfo.id !== rfoId);

        queryClient.setQueryData('get-rfos', newRfos);
        return { rfos };
      },
      onError(error, _, context) {
        if (context) queryClient.setQueryData('get-rfos', context.rfos);

        message.error('Cannot delete this rfo');
      },
    },
  );
};

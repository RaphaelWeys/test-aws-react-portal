import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Rfo } from '../../../interface/rfo';

type TValues = Rfo;

interface TContext {
  currentRfos: Rfo[];
}
export const useUpdateRfo = (rfoId: string) => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<Rfo, AxiosError<Rfo>, TValues, TContext>(
    (data) => client.put(`${process.env.REACT_APP_BACKEND_TENDER_URL}/rfos/${rfoId}`, data).then((res) => res.data),
    {
      onMutate(rfo) {
        const currentRfos = queryClient.getQueryData('get-rfos') as Rfo[];
        const newRfos = currentRfos.map((item) => (item.id === rfoId ? rfo : item));
        queryClient.setQueryData('get-rfos', newRfos);

        return { currentRfos };
      },
      onSuccess() {
        queryClient.invalidateQueries('get-rfos');
      },
      onError(error, _, context) {
        if (context) queryClient.setQueryData('get-rfos', context.currentRfos);

        message.error('Cannot update the rfo');
      },
    },
  );
};

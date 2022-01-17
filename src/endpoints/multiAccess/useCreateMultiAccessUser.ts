import { message } from 'antd';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';

import { useApi } from '../../context/ApiContext';

export interface UserCreated {
  role: string;
  isMultiAccess: boolean;
  kamGroupIds: string[];
  admin: boolean;
  demo: boolean;
  language: string;
  validated: boolean;
  userIsInvitedSupplier: boolean;
  invitedConditionsAccepted: boolean;
  invitedAcceptMarketing: boolean;
  isDeleted: boolean;
  _id: string;
  company: string;
  multiaccess: {
    clientCanLogin: boolean;
    contractsManagedBy: string;
    clientReference: null;
    isDailyAccount: boolean;
  };
  lastName: string;
  firstName: string;
  username: string;
  phone: string;
  createdDate: string;
  hash: string;
  kamId: string;
  tenant: string;
  mailValidationToken: string;
  mailValidationExpires: string;
  __v: 0;
  id: string;
}

export const useCreateMultiAccessUser = () => {
  const client = useApi();
  const queryClient = useQueryClient();

  return useMutation<UserCreated, AxiosError<UserCreated>, any>(
    (values) => client.post('/users/multi-access/create', values).then((res) => res.data),
    {
      onSuccess() {
        queryClient.invalidateQueries('get-multi-access-users');
      },
      onError() {
        message.error('Request failed to create the user');
      },
    },
  );
};

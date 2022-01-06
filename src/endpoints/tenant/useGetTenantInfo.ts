import { useMutation } from 'react-query';
import axios, { AxiosError } from 'axios';

import { TenantInfo } from '../../interface/tenant';

interface Variables {
  domain: string;
}

export const useGetTenantInfo = () =>
  useMutation<TenantInfo, AxiosError<TenantInfo>, Variables>('get-tenant-info', (payload) =>
    axios.post(`${process.env.REACT_APP_BACKEND_PORTAL_URL}/tenant/info`, payload).then((res) => res.data),
  );

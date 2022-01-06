import { message } from 'antd';
import { AxiosError } from 'axios';
import i18next from 'i18next';
import { useMutation } from 'react-query';

import { useApi } from '../../../context/ApiContext';

interface TValues {
  value: string;
  subject: string;
}

export const useUpdateTemplate = (templateId = '') => {
  const client = useApi();

  return useMutation<string, AxiosError<string>, TValues>(
    (data) => client.put(`/template/content/${templateId}`, data).then((res) => res.data),
    {
      onSuccess() {
        message.success(i18next.t('admin-template-update-success'));
      },
      onError() {
        message.error(i18next.t('admin-template-update-error'));
      },
    },
  );
};

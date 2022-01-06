import { message } from 'antd';
import { AxiosError } from 'axios';
import i18next from 'i18next';
import { useMutation } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Document } from '../../../interface/document';
import { Template } from '../../../interface/template';
import { getCorrectBackend } from '../../../utils';

interface TValues {
  template: Template;
}

export const useUpdateDocuments = (app: string) => {
  const client = useApi();
  const baseUrl = getCorrectBackend(app);

  return useMutation<Document[], AxiosError<Document[]>, TValues>(
    (data) => client.post(`${baseUrl}/template/documents`, data).then((res) => res.data),
    {
      onError() {
        message.error(i18next.t('admin-document-get-error'));
      },
    },
  );
};

import { message } from 'antd';
import { AxiosError } from 'axios';
import i18next from 'i18next';
import { useQuery } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { getCorrectBackend } from '../../../utils';

export const useDownloadDocument = (app: string, filename: string) => {
  const client = useApi();
  const baseUrl = getCorrectBackend(app);

  return useQuery<string, AxiosError<string>>(
    ['download-document', filename],
    () => client.get(`${baseUrl}/template/download/preview/${filename}`).then((res) => res.data),
    {
      onSuccess(data) {
        const element = document.createElement('a');
        const isHTML = data.includes('DOCTYPE');

        element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(data)}`);
        element.setAttribute('download', `preview.${isHTML ? 'html' : 'pdf'}`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
        message.success(i18next.t('global-done'));
      },
      onError() {
        message.error(i18next.t('global-failed'));
      },
      enabled: false,
    },
  );
};

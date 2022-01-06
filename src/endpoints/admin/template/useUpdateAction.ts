import { message } from 'antd';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';

import { useApi } from '../../../context/ApiContext';
import { Template, TemplateAction } from '../../../interface/template';
import { getCorrectBackend } from '../../../utils';

interface TValues {
  action: string;
  checkboxes: { [key: string]: boolean } | undefined;
  document: string | undefined;
  template: Template | undefined;
  language: string;
}

export const useUpdateAction = (app: string) => {
  const client = useApi();
  const baseUrl = getCorrectBackend(app);
  const [t] = useTranslation();

  return useMutation<TemplateAction, AxiosError<TemplateAction>, TValues>(
    (data) => client.post(`${baseUrl}/template/action`, data).then((res) => res.data),
    {
      onSuccess() {
        message.success(t('global-done'));
      },
      onError() {
        message.error(t('global-failed'));
      },
    },
  );
};

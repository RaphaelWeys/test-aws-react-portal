import { AxiosRequestConfig } from 'axios';
import memoize from 'lodash/memoize';

export const optionsGetTemplate = memoize(
  (templateId): AxiosRequestConfig => ({
    method: 'get',
    url: `/template/content/${templateId}`,
  }),
);

export const optionsUpdateTemplate = memoize(
  (templateId): AxiosRequestConfig => ({
    method: 'put',
    url: `/template/content/${templateId}`,
  }),
);

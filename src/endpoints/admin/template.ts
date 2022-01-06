import memoize from 'lodash/memoize';
import { AxiosRequestConfig } from 'axios';

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

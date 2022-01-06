import { AxiosRequestConfig } from 'axios';
import memoize from 'lodash/memoize';

export const optionsGetSignaturePackSupplier = memoize(
  (packSignatureId): AxiosRequestConfig => ({
    method: 'get',
    url: `/signature/docSupplier/info/${packSignatureId}`,
  }),
);

export const optionsGetSignaturePackClient = memoize(
  (packSignatureId): AxiosRequestConfig => ({
    method: 'get',
    url: `/signature/docSigner/info/${packSignatureId}`,
  }),
);

export const optionsUpdateSignaturePack = memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    url: `/signature/docSupplier/create`,
  }),
);

export const optionsAbortCurrentContractSupplier = memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    url: `/signature/docSupplier/abort`,
  }),
);

export const optionsAbortCurrentContractClient = memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    url: `/signature/docSigner/abort`,
  }),
);

export const optionsStartProcessSignature = memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    url: `/signature/docSigner/create`,
  }),
);

export const optionsSendEmailAgain = memoize(
  (): AxiosRequestConfig => ({
    method: 'post',
    url: `/signature/docSigner/sendinvite`,
  }),
);

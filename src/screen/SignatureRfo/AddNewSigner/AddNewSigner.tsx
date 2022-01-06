import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { useForm } from 'react-hook-form';

import AddNewSignerItem from './AddNewSignerItem';
import { SignersForm, ValidatorsForm } from '../SignatureRfo';
import CommonButton from '../../../components/CommonButton';
import { Error } from '../../../style/utils';
import useRequest from '../../../hooks/useRequest';
import { optionsStartProcessSignature } from '../../../endpoints/signature';

interface Props {
  className?: string;
  setShowAddValidators: (value: boolean) => void;
  packId: string;
  getSignaturePack: () => Promise<any>;
  onSubmitSuccess: () => void;
}

const AddNewSigner: FC<Props> = ({ className, setShowAddValidators, packId, getSignaturePack, onSubmitSuccess }) => {
  const [t] = useTranslation();
  const [error, setError] = useState('');
  const { request: createProcess, isPending } = useRequest(optionsStartProcessSignature());
  const [validators, setValidators] = useState<ValidatorsForm[]>([]);
  const [signers, setSigners] = useState<SignersForm[]>([]);
  const formValidatorsMethods = useForm();
  const formSignersMethods = useForm();

  const handleSubmitValidators = useCallback((data) => setValidators((ps) => [...ps, data]), []);
  const handleSubmitSigner = useCallback((data) => {
    setError('');
    setSigners((ps) => [...ps, data]);
  }, []);

  const handleDeleteValidators = useCallback(
    (indexItem: number) => {
      const tmpValidators = [...validators];

      const resultIndex = validators.findIndex((item, index) => index === indexItem);

      if (resultIndex >= 0) {
        tmpValidators.splice(resultIndex, 1);
        setValidators(tmpValidators);
      }
    },
    [validators],
  );

  const handleDeleteSigners = useCallback(
    (indexItem: number) => {
      const tmpSigner = [...signers];

      const resultIndex = signers.findIndex((item, index) => index === indexItem);

      if (resultIndex >= 0) {
        tmpSigner.splice(resultIndex, 1);
        setSigners(tmpSigner);
      }
    },
    [signers],
  );

  const onSubmit = useCallback(() => {
    if (signers.length === 0) {
      setError('signature-rfo-signer-missing');
    } else {
      createProcess({ data: { id: packId, validators, signers } }).then(() => {
        getSignaturePack().then(() => {
          onSubmitSuccess();
        });
      });
    }
  }, [signers, validators, getSignaturePack, createProcess, packId, onSubmitSuccess]);

  return (
    <Space className={className} direction="vertical">
      <AddNewSignerItem
        onSubmit={handleSubmitValidators}
        title={t('signature-rfo-choose-validator-title')}
        description={t('signature-rfo-choose-validator-description')}
        isValidator
        items={validators}
        handleDeleteItem={handleDeleteValidators}
        formMethods={formValidatorsMethods}
        signers={signers}
        validators={validators}
      />
      <AddNewSignerItem
        onSubmit={handleSubmitSigner}
        items={signers}
        title={t('signature-rfo-choose-signer-title')}
        description={t('signature-rfo-choose-signer-description')}
        handleDeleteItem={handleDeleteSigners}
        formMethods={formSignersMethods}
        signers={signers}
        validators={validators}
      />
      {error && <Error>{t(error)}</Error>}
      <Space>
        <CommonButton onClick={() => setShowAddValidators(false)}>{t('global-back')}</CommonButton>
        <CommonButton type="primary" onClick={onSubmit} loading={isPending}>
          {t('signature-rfo-start-signature')}
        </CommonButton>
      </Space>
    </Space>
  );
};

export default styled(AddNewSigner)``;

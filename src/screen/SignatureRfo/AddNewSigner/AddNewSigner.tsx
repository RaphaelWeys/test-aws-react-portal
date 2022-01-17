import { Space } from 'antd';
import React, { FC, useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CommonButton from '../../../components/CommonButton';
import { optionsStartProcessSignature } from '../../../endpoints/signature';
import useRequest from '../../../hooks/useRequest';
import { Error } from '../../../style/utils';
import { SignersForm, ValidatorsForm } from '../SignatureRfo';
import AddNewSignerItem from './AddNewSignerItem';

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
        isValidator
        description={t('signature-rfo-choose-validator-description')}
        formMethods={formValidatorsMethods}
        handleDeleteItem={handleDeleteValidators}
        items={validators}
        signers={signers}
        title={t('signature-rfo-choose-validator-title')}
        validators={validators}
        onSubmit={handleSubmitValidators}
      />
      <AddNewSignerItem
        description={t('signature-rfo-choose-signer-description')}
        formMethods={formSignersMethods}
        handleDeleteItem={handleDeleteSigners}
        items={signers}
        signers={signers}
        title={t('signature-rfo-choose-signer-title')}
        validators={validators}
        onSubmit={handleSubmitSigner}
      />
      {error && <Error>{t(error)}</Error>}
      <Space>
        <CommonButton onClick={() => setShowAddValidators(false)}>{t('global-back')}</CommonButton>
        <CommonButton loading={isPending} type="primary" onClick={onSubmit}>
          {t('signature-rfo-start-signature')}
        </CommonButton>
      </Space>
    </Space>
  );
};

export default styled(AddNewSigner)``;

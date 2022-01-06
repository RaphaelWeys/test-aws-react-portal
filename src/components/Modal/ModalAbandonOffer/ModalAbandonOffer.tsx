import React, { FC, useCallback, useEffect } from 'react';
import { ModalProps } from 'antd/lib/modal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { Space } from 'antd';
import { useParams } from 'react-router-dom';

import Modal from '../Modal';
import TextArea from '../../Input/TextArea';
import CommonButton from '../../CommonButton';
import useRequest from '../../../hooks/useRequest';
import { optionsAbortCurrentContractClient, optionsAbortCurrentContractSupplier } from '../../../endpoints/signature';

type Props = {
  className?: string;
  customCancel: () => void;
  getSignaturePack: () => Promise<any>;
  packId: string;
} & ModalProps;

const ModalAbandonOffer: FC<Props> = ({ className, customCancel, packId, getSignaturePack, ...modalProps }) => {
  const [t] = useTranslation();
  const { register, control, handleSubmit, errors } = useForm();
  const { user } = useParams<{ user: string }>();
  const options = user === 'supplier' ? optionsAbortCurrentContractSupplier() : optionsAbortCurrentContractClient();
  const { request: abortContract } = useRequest(options);

  useEffect(() => {
    register({ name: 'reason' }, { required: true });
  }, [register]);

  const onSubmit = useCallback(
    (data) => {
      abortContract({
        data: {
          id: packId,
          ...data,
        },
      }).then(() => {
        getSignaturePack().then(() => {
          customCancel();
        });
      });
    },
    [abortContract, customCancel, getSignaturePack, packId],
  );

  return (
    <Modal
      className={className}
      visible
      title={t('modal-abandon-offer-title')}
      getContainer={false}
      footer={false}
      size="large"
      {...modalProps}
    >
      <Space direction="vertical" size="middle">
        <div>{t('modal-abandon-offer-description-info')}</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Space direction="vertical">
            <Controller
              as={TextArea}
              name="reason"
              control={control}
              label={t('modal-abandon-offer-text-area-label')}
              error={errors.reason}
            />
            <Space>
              <CommonButton onClick={customCancel}>{t('global-cancel')}</CommonButton>
              <CommonButton htmlType="submit" className="orange">
                {t('modal-abandon-offer-button')}
              </CommonButton>
            </Space>
          </Space>
        </form>
      </Space>
    </Modal>
  );
};

export default styled(ModalAbandonOffer)`
  &&& {
    .orange,
    .orange:hover {
      background-color: #de6811;
      color: white;
      border-color: #de6811;
    }
  }
`;

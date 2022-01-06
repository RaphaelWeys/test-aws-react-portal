import React, { FC } from 'react';
import styled from 'styled-components';
import { Col, Row, Space } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { useTranslation } from 'react-i18next';

import Modal from '../Modal';
import GradientButton from '../../GradientButton/GradientButton';
import { useTransfersAccount } from '../../../endpoints/multiAccess/useTransfersAccount';
import Hr from '../../Hr';
import Select from '../../Select';
import { TextRegular } from '../../../style/utils';
import TransfersAccountIcon from '../../icons/TransfersAccountIcon';
import { Navigation } from '../../../navigation';
import { useHistory } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import { useGetKamListForKam } from '../../../endpoints/multiAccess/useGetKamListForKam';

interface Props extends ModalProps {
  className?: string;
  userId: string;
  onClose: () => void;
  title: string;
}

const ModalTransfersAccount: FC<Props> = ({ className, title, onClose, userId, ...modalProps }) => {
  const [t] = useTranslation();
  const { mutate: transfersAccount, isLoading } = useTransfersAccount();
  const { data } = useGetKamListForKam();
  const { register, control, handleSubmit, errors } = useForm();
  const history = useHistory();

  React.useEffect(() => {
    register({ name: 'kam' }, { required: true });
  }, [register]);

  const onSubmit = React.useCallback(
    (values) => {
      transfersAccount(
        { clientId: userId, newKamId: values.kam },
        {
          onSuccess() {
            history.push(Navigation.MULTI_ACCESS);
          },
        },
      );
    },
    [history, transfersAccount, userId],
  );

  return (
    <Modal
      className={className}
      size="large"
      onCancel={onClose}
      {...modalProps}
      icon={<TransfersAccountIcon />}
      title={title}
    >
      <Space direction="vertical" size={25}>
        <div>
          <TextRegular>{t('modal-transfert-account-description-info')}</TextRegular>

          <Hr />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col xs={24} sm={8}>
                <Controller
                  as={Select}
                  name="kam"
                  control={control}
                  items={(data || []).map((item) => ({
                    label: `${item.lastName} ${item.firstName}`,
                    value: item.id,
                    key: item.id,
                  }))}
                  label={t('modal-transfert-account-select')}
                  error={errors.kam}
                />
              </Col>
            </Row>

            <Hr />

            <Space size="middle">
              <GradientButton onClick={onClose} variant="outlined">
                {t('global-close')}
              </GradientButton>
              <GradientButton isLoading={isLoading} type="submit">
                {t('global-transfert')}
              </GradientButton>
            </Space>
          </form>
        </div>
      </Space>
    </Modal>
  );
};

export default styled(ModalTransfersAccount)``;

import { Col, Row, Space } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { useGetKamListForManager } from '../../../endpoints/multiAccess/useGetKamListForManager';
import { useTransfersAllAccount } from '../../../endpoints/multiAccess/useTransfersAllAccount';
import { Navigation } from '../../../navigation';
import { TextRegular } from '../../../style/utils';
import GradientButton from '../../GradientButton/GradientButton';
import Hr from '../../Hr';
import TransfersAccountIcon from '../../icons/TransfersAccountIcon';
import Select from '../../Select';
import Modal from '../Modal';

interface Props extends ModalProps {
  className?: string;
  userId: string;
  onClose: () => void;
  firstName: string;
  lastName: string;
}

const ModalTransfersAllAccount: FC<Props> = ({ className, onClose, userId, firstName, lastName }) => {
  const [t] = useTranslation();
  const { mutate: transfersAccount, isLoading } = useTransfersAllAccount();
  const { data, isLoading: getKamLoading } = useGetKamListForManager();
  const { register, control, handleSubmit, errors } = useForm();
  const history = useHistory();

  React.useEffect(() => {
    register({ name: 'kam' }, { required: true });
  }, [register]);

  const onSubmit = React.useCallback(
    (values) => {
      transfersAccount(
        { currentKamId: userId, newKamId: values.kam },
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
      icon={<TransfersAccountIcon />}
      size="large"
      title={`${firstName} ${lastName}`}
      onCancel={onClose}
    >
      <Space direction="vertical" size={25}>
        <div>
          <TextRegular>{t('modal-transfert-all-account-description-info')}</TextRegular>

          <Hr />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col span={24}>
                <Controller
                  as={Select}
                  control={control}
                  error={errors.kam}
                  items={(data || [])
                    .filter((item) => item.id !== userId)
                    .map((item) => ({
                      label: `${item.lastName} ${item.firstName}`,
                      value: item.id,
                      key: item.id,
                    }))}
                  label={t('modal-transfert-all-account-select')}
                  loading={getKamLoading}
                  name="kam"
                  style={{ width: '300px' }}
                />
              </Col>
            </Row>

            <Hr />

            <Space size="middle">
              <GradientButton variant="outlined" onClick={onClose}>
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

export default styled(ModalTransfersAllAccount)``;

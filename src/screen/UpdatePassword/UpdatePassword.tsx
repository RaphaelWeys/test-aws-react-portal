import { Col, Row, Space } from 'antd';
import React, { FC, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import GradientButton from '../../components/GradientButton/GradientButton';
import { Input } from '../../components/Input';
import { AlertStyled } from '../../components/Modal/ScreenModal/ForgotPasswordModal/ForgotPasswordModal.styled';
import { getValidationCheck } from '../../constants';
import { useUpdatePassword } from '../../endpoints/user/useUpdatePassword';
import MainLayout from '../../layout/MainLayout';
import RectangleBox from '../../layout/RectangleBox/RectangleBox';
import { Navigation } from '../../navigation';
import history from '../../router/history';
import { TextRegular } from '../../style/utils';
import { WrapperAlert } from './UpdatePassword.styled';

interface Props {
  className?: string;
}

interface FormData {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const UpdatePassword: FC<Props> = ({ className }) => {
  const [t] = useTranslation();
  const { mutate: updatePassword, isLoading, error, isSuccess } = useUpdatePassword();
  const { register, handleSubmit, control, errors, watch } = useForm<FormData>();
  const newPassword = useRef('');
  newPassword.current = watch('newPassword');

  useEffect(() => {
    register({ name: 'oldPassword' }, { required: true });
    register({ name: 'newPassword' }, { required: true, ...getValidationCheck() });
    register(
      { name: 'confirmNewPassword' },
      {
        required: true,
        validate: (value) => (value !== newPassword.current ? 'global-field-valid' : true),
      },
    );
  }, [register]);

  const onSubmit = (data: FormData): void => {
    updatePassword({
      currentPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  const handleClickContinue = React.useCallback(() => {
    const callback = localStorage.getItem('callback');

    if (callback) window.location.assign(callback);
    else history.push(Navigation.DASHBOARD);
  }, []);

  return (
    <MainLayout>
      <div className={className}>
        <RectangleBox showLogo={false} title={t('update-password-title')}>
          <Space align="center" direction="vertical" size="large">
            <WrapperAlert>
              {error && <AlertStyled showIcon message={t('update-password-changed-failed')} type="error" />}
            </WrapperAlert>

            {isSuccess ? (
              <>
                <TextRegular>{t('update-password-changed-success')}</TextRegular>
                <GradientButton onClick={handleClickContinue}>{t('global-continue')}</GradientButton>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row gutter={[0, 18]} justify="center">
                  <Col span={24}>
                    <Controller
                      as={Input}
                      control={control}
                      error={errors?.oldPassword}
                      label={t('update-password-current-password')}
                      name="oldPassword"
                      type="password"
                    />
                  </Col>
                  <Col span={24}>
                    <Controller
                      as={Input}
                      control={control}
                      error={errors?.newPassword}
                      label={t('update-password-new-password')}
                      name="newPassword"
                      type="password"
                    />
                  </Col>
                  <Col span={24}>
                    <Controller
                      as={Input}
                      control={control}
                      error={errors?.confirmNewPassword}
                      label={t('update-password-confirm-new-password')}
                      name="confirmNewPassword"
                      type="password"
                    />
                  </Col>
                  <Col span={12}>
                    <GradientButton isLoading={isLoading} type="submit">
                      {t('global-change')}
                    </GradientButton>
                  </Col>
                </Row>
              </form>
            )}
          </Space>
        </RectangleBox>
      </div>
    </MainLayout>
  );
};

export default styled(UpdatePassword)`
  display: flex;
  justify-content: center;
  width: 28rem;
`;

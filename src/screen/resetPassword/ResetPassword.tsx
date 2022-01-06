/* eslint-disable no-nested-ternary */
import React, { FC, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import CustomLink from '../../components/CustomLink/CustomLink';
import RectangleBox from '../../layout/RectangleBox/RectangleBox';
import { Input } from '../../components/Input';
import GradientButton from '../../components/GradientButton/GradientButton';
import { AlertStyled } from '../../components/Modal/ScreenModal/ForgotPasswordModal/ForgotPasswordModal.styled';
import { getValidationCheck } from '../../constants';
import { HeaderOne, TextRegular } from '../../style/utils';
import { useResetPassword } from '../../endpoints/user/useResetPassword';
import { Col, Row, Space } from 'antd';
import { getQueryParameters } from '../../utils/url';

interface Props {
  className?: string;
}

interface FormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword: FC<Props> = ({ className }) => {
  const [t] = useTranslation();
  const history = useHistory();
  const { token } = getQueryParameters();
  const { register, handleSubmit, control, errors, watch } = useForm<FormData>();
  const { mutate: resetPassword, data: resResetPassword, isLoading, error } = useResetPassword();
  const password = useRef({});
  password.current = watch('password');

  React.useEffect(() => {
    register({ name: 'password' }, { required: true, ...getValidationCheck() });
  }, [register]);

  // We need this second useEffect to not reset others fields
  React.useEffect(() => {
    register(
      { name: 'confirmPassword' },
      {
        required: true,
        validate: (value) => (value !== password.current ? (t('global-field-valid') as string) : true),
      },
    );
  }, [register, t]);

  const onSubmit = (data: FormData): void => {
    resetPassword({
      newPassword: data.password,
      token: token.toString(),
    });
  };

  return (
    <div className={className}>
      <RectangleBox>
        <Space direction="vertical" size="large" align="center">
          {!resResetPassword && (
            <>
              <TextRegular>
                {t('register-have-account')} <CustomLink to="/login">{t('register-connection-link')}</CustomLink>
              </TextRegular>
              <HeaderOne>{t('reset-password-title')}</HeaderOne>
            </>
          )}
          {error && <AlertStyled message={t('reset-password-change-password-failed')} type="error" showIcon />}
          {!token ? (
            <AlertStyled message={t('reset-password-no-token')} type="warning" showIcon />
          ) : resResetPassword ? (
            <>
              <AlertStyled message={t('reset-password-change-password-success')} type="success" showIcon />
              <GradientButton onClick={(): void => history.push('/login')} noGradient variant="outlined" fullWidth>
                {t('reset-password-back-login')}
              </GradientButton>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row gutter={[0, 18]}>
                <Col span={24}>
                  <Controller
                    as={Input}
                    name="password"
                    label={t('reset-password-new-password')}
                    control={control}
                    type="password"
                    error={errors?.password}
                  />
                </Col>
                <Col span={24}>
                  <Controller
                    as={Input}
                    name="confirmPassword"
                    label={t('reset-password-confirm-new-password')}
                    control={control}
                    type="password"
                    error={errors?.confirmPassword}
                  />
                </Col>

                <GradientButton type="submit" isLoading={isLoading} fullWidth>
                  {t('reset-password-change-password')}
                </GradientButton>
              </Row>
            </form>
          )}
        </Space>
      </RectangleBox>
    </div>
  );
};

export default styled(ResetPassword)`
  width: 28rem;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
`;

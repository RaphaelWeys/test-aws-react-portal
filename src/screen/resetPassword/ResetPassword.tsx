/* eslint-disable no-nested-ternary */
import { Col, Row, Space } from 'antd';
import React, { FC, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import CustomLink from '../../components/CustomLink/CustomLink';
import GradientButton from '../../components/GradientButton/GradientButton';
import { Input } from '../../components/Input';
import { AlertStyled } from '../../components/Modal/ScreenModal/ForgotPasswordModal/ForgotPasswordModal.styled';
import { getValidationCheck } from '../../constants';
import { useResetPassword } from '../../endpoints/user/useResetPassword';
import RectangleBox from '../../layout/RectangleBox/RectangleBox';
import { HeaderOne, TextRegular } from '../../style/utils';
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
        <Space align="center" direction="vertical" size="large">
          {!resResetPassword && (
            <>
              <TextRegular>
                {t('register-have-account')} <CustomLink to="/login">{t('register-connection-link')}</CustomLink>
              </TextRegular>
              <HeaderOne>{t('reset-password-title')}</HeaderOne>
            </>
          )}
          {error && <AlertStyled showIcon message={t('reset-password-change-password-failed')} type="error" />}
          {!token ? (
            <AlertStyled showIcon message={t('reset-password-no-token')} type="warning" />
          ) : resResetPassword ? (
            <>
              <AlertStyled showIcon message={t('reset-password-change-password-success')} type="success" />
              <GradientButton fullWidth noGradient variant="outlined" onClick={(): void => history.push('/login')}>
                {t('reset-password-back-login')}
              </GradientButton>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row gutter={[0, 18]}>
                <Col span={24}>
                  <Controller
                    as={Input}
                    control={control}
                    error={errors?.password}
                    label={t('reset-password-new-password')}
                    name="password"
                    type="password"
                  />
                </Col>
                <Col span={24}>
                  <Controller
                    as={Input}
                    control={control}
                    error={errors?.confirmPassword}
                    label={t('reset-password-confirm-new-password')}
                    name="confirmPassword"
                    type="password"
                  />
                </Col>

                <GradientButton fullWidth isLoading={isLoading} type="submit">
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

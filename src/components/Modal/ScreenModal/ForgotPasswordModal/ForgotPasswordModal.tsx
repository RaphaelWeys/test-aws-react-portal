import { Alert, Spin } from 'antd';
import React, { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { regexEmail } from '../../../../constants';
import { useForgotPassword } from '../../../../endpoints/registration/useForgetPassword';
import { TextRegular } from '../../../../style/utils';
import GradientButton from '../../../GradientButton';
import { Input } from '../../../Input';
import Modal from '../../Modal';
import { FormStyled } from './ForgotPasswordModal.styled';

export interface FormForgotPasswordModal {
  username: string;
}

interface PropsForgotPasswordModal {
  className?: string;
  toggleModal: () => void;
}

const ForgotPasswordModal: FC<PropsForgotPasswordModal> = ({ className, toggleModal }) => {
  const [t] = useTranslation();
  const { register, handleSubmit, control, errors, reset } = useForm<FormForgotPasswordModal>();
  const { mutate: sendEmailResetPassword, error: errorMailNotFound, isLoading, data } = useForgotPassword();

  useEffect(() => {
    register({ name: 'username' }, { required: true, pattern: regexEmail });
  }, [register]);

  const onSubmit = (data: FormForgotPasswordModal) => {
    sendEmailResetPassword(data, {
      onSuccess() {
        reset({ username: '' });
      },
    });
  };

  return (
    <Modal onCancel={toggleModal} title={t('forgot-password-title')} size="small" className={className}>
      {errorMailNotFound && <Alert message={t('forgot-password-email-not-found')} type="error" showIcon />}
      {data ? (
        <>
          <TextRegular>{t('forgot-password-email-found')}</TextRegular>
          <GradientButton type="button" onClick={() => toggleModal()}>
            {t('global-close')}
          </GradientButton>
        </>
      ) : (
        <Spin spinning={isLoading}>
          <FormStyled onSubmit={handleSubmit(onSubmit)}>
            <Controller
              as={Input}
              name="username"
              label={t('forgot-password-email')}
              control={control}
              type="email"
              htmlFor="username"
              error={errors?.username}
              autoFocus
            />
            <GradientButton type="submit">{t('global-send')}</GradientButton>
          </FormStyled>
        </Spin>
      )}
    </Modal>
  );
};

export default styled(ForgotPasswordModal)`
  ${GradientButton} {
    margin-top: 25px;
    align-self: center;
  }
`;

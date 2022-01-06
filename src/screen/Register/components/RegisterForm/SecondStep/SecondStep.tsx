import { useStateMachine } from 'little-state-machine';
import React, { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import GradientButton from '../../../../../components/GradientButton';
import { Input } from '../../../../../components/Input';
import { regexEmail } from '../../../../../constants';
import { useCheckUsername } from '../../../../../endpoints/registration/useCheckUsername';
import { updateRegisterForm } from '../../../../../StoreForm/updateState';
import { Col, Row } from 'antd';

interface PropsSecondStep {
  className?: string;
  previousStep: () => void;
  nextStep: () => void;
}

export interface FormRegisterStep2 {
  firstName: string;
  lastName: string;
  username: string;
}

const SecondStep: FC<PropsSecondStep> = ({ className, previousStep, nextStep }) => {
  const [t] = useTranslation();
  const { actions, state } = useStateMachine({ updateRegisterForm });
  const { register, control, errors, handleSubmit, setError } = useForm<FormRegisterStep2>({
    defaultValues: state.createUserForm,
  });
  const { mutate: checkEmailExist, isLoading: checkEmailPending } = useCheckUsername();

  useEffect(() => {
    register({ name: 'firstName' }, { required: true });
    register({ name: 'lastName' }, { required: true });
    register(
      { name: 'username' },
      {
        required: true,
        validate: (value: string) => {
          if (!value.match(regexEmail)) {
            return 'email-not-valid';
          }

          return undefined;
        },
      },
    );
  }, [register, checkEmailExist]);

  const onSubmit = (values: FormRegisterStep2) => {
    actions.updateRegisterForm(values);
    checkEmailExist(values.username, {
      onSuccess(response) {
        if (response)
          if (response.exists) setError('username', { message: 'register-surname-failed' });
          else nextStep();
      },
    });
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, 18]}>
          <Col span={24}>
            <Controller
              as={Input}
              name="firstName"
              label={t('register-firstname')}
              control={control}
              type="text"
              error={errors?.firstName}
              htmlFor="firstName"
              autoFocus
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              name="lastName"
              label={t('register-surname')}
              control={control}
              type="text"
              error={errors?.lastName}
              htmlFor="lastName"
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              name="username"
              label={t('register-email')}
              control={control}
              type="email"
              htmlFor="email"
              error={errors?.username}
              isPending={checkEmailPending}
            />
          </Col>
          <Col span={24}>
            <Row gutter={18} justify="center">
              <Col>
                <GradientButton onClick={previousStep} noGradient variant="outlined" fullWidth>
                  {t('global-previous')}
                </GradientButton>
              </Col>
              <Col>
                <GradientButton type="submit" fullWidth>
                  {t('global-next')}
                </GradientButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default styled(SecondStep)``;

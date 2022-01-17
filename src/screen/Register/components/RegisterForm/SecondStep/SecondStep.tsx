import { Col, Row } from 'antd';
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
import { FormRegisterStep2 } from '../RegisterForm.interface';

interface PropsSecondStep {
  className?: string;
  previousStep: () => void;
  nextStep: () => void;
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
              autoFocus
              as={Input}
              control={control}
              error={errors?.firstName}
              htmlFor="firstName"
              label={t('register-firstname')}
              name="firstName"
              type="text"
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              control={control}
              error={errors?.lastName}
              htmlFor="lastName"
              label={t('register-surname')}
              name="lastName"
              type="text"
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              control={control}
              error={errors?.username}
              htmlFor="email"
              isPending={checkEmailPending}
              label={t('register-email')}
              name="username"
              type="email"
            />
          </Col>
          <Col span={24}>
            <Row gutter={18} justify="center">
              <Col>
                <GradientButton fullWidth noGradient variant="outlined" onClick={previousStep}>
                  {t('global-previous')}
                </GradientButton>
              </Col>
              <Col>
                <GradientButton fullWidth type="submit">
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

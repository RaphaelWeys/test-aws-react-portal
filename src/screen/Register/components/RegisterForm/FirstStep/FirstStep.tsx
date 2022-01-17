import { Col, Row } from 'antd';
import { useStateMachine } from 'little-state-machine';
import React, { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import GradientButton from '../../../../../components/GradientButton';
import { Input } from '../../../../../components/Input';
import { updateRegisterForm } from '../../../../../StoreForm/updateState';
import { FormRegisterStep1 } from '../RegisterForm.interface';

interface PropsFirstStep {
  className?: string;
  nextStep: () => void;
}

const FirstStep: FC<PropsFirstStep> = ({ className, nextStep }) => {
  const { actions, state } = useStateMachine({ updateRegisterForm });
  const { register, control, errors, handleSubmit } = useForm<FormRegisterStep1>({
    defaultValues: state.createUserForm,
  });
  const [t] = useTranslation();

  useEffect(() => {
    register({ name: 'company' }, { required: true });
    register({ name: 'companyField' }, { required: true });
    register({ name: 'affiliation' });
  }, [register]);

  const onSubmit = (data: FormRegisterStep1) => {
    actions.updateRegisterForm(data);
    nextStep();
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
              error={errors?.company}
              htmlFor="company"
              label={t('register-society')}
              name="company"
              type="text"
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              control={control}
              error={errors?.companyField}
              htmlFor="companyField"
              label={t('register-sector')}
              name="companyField"
              type="text"
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              control={control}
              error={errors?.affiliation}
              htmlFor="affiliation"
              label={t('register-affiliation')}
              name="affiliation"
              type="text"
            />
          </Col>
          <Col push={6} span={12}>
            <GradientButton fullWidth type="submit">
              {t('global-next')}
            </GradientButton>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default FirstStep;

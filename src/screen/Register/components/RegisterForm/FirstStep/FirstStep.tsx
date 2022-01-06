import React, { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStateMachine } from 'little-state-machine';

import { Input } from '../../../../../components/Input';
import GradientButton from '../../../../../components/GradientButton';
import { updateRegisterForm } from '../../../../../StoreForm/updateState';
import { Col, Row } from 'antd';

interface PropsFirstStep {
  className?: string;
  nextStep: () => void;
}

export interface FormRegisterStep1 {
  company: string;
  companyField: string;
  affiliation?: string;
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
              as={Input}
              name="company"
              label={t('register-society')}
              control={control}
              type="text"
              error={errors?.company}
              htmlFor="company"
              autoFocus
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              name="companyField"
              label={t('register-sector')}
              control={control}
              type="text"
              error={errors?.companyField}
              htmlFor="companyField"
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              name="affiliation"
              label={t('register-affiliation')}
              control={control}
              type="text"
              htmlFor="affiliation"
              error={errors?.affiliation}
            />
          </Col>
          <Col span={12} push={6}>
            <GradientButton type="submit" fullWidth>
              {t('global-next')}
            </GradientButton>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default FirstStep;

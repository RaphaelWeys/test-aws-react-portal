import { Col, Row, Space } from 'antd';
import { useStateMachine } from 'little-state-machine';
import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import GradientButton from '../../../../../components/GradientButton';
import { Checkbox, Input } from '../../../../../components/Input';
import InvisibleButton from '../../../../../components/InvisibleButton';
import Modal from '../../../../../components/Modal/Modal';
import SafeHTMLTranslate from '../../../../../components/SafeHTMLTranslate';
import { getValidationCheck } from '../../../../../constants';
import { updateRegisterForm } from '../../../../../StoreForm/updateState';
import { WrapperCheckbox } from './ThirdStep.styled';
import { FormRegister } from '../RegisterForm';
import { getTextWithFunctionInside } from '../../../../../utils/string';

interface PropsThirdStep {
  className?: string;
  previousStep: () => void;
  handleCreateUser: (payload: FormRegister) => void;
  mutationIsLoading: boolean;
}

export type FormRegisterStep3 = {
  password: string;
  confirmPassword: string;
  preferences: {
    personalDataProcessing: boolean;
    agreeTermsConditions: boolean;
    agreePrivacyPolicy: boolean;
  };
};

const ThirdStep: FC<PropsThirdStep> = ({ className, previousStep, handleCreateUser, mutationIsLoading }) => {
  const { actions, state } = useStateMachine({ updateRegisterForm });
  const { register, control, errors, watch, handleSubmit } = useForm<FormRegisterStep3>({
    defaultValues: state.createUserForm,
  });
  const [t] = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: '', content: '' });
  const password = useRef({});
  password.current = watch('password');

  useEffect(() => {
    register({ name: 'password' }, { required: true, ...getValidationCheck() });
    register({ name: 'preferences.agreeTermsConditions' }, { required: true });
    register({ name: 'preferences.agreePrivacyPolicy' }, { required: true });
    register({ name: 'preferences.personalDataProcessing' });
  }, [register]);

  // We need this second useEffect to not reset others fields
  useEffect(() => {
    register(
      { name: 'confirmPassword' },
      {
        required: true,
        validate: (value: string) => (value !== password.current ? (t('global-field-valid') as string) : true),
      },
    );
  }, [register, t]);

  const handleOpenModal = useCallback(
    (modalNumber: number): void => {
      if (modalNumber === 0) {
        setModalInfo({
          title: t('header-modal-general-title'),
          content: 'header-modal-general-content-info',
        });
      }
      if (modalNumber === 1) {
        setModalInfo({
          title: t('header-modal-privacy-title'),
          content: 'header-modal-privacy-content-info',
        });
      }
      setShowModal(true);
    },
    [setShowModal, setModalInfo, t],
  );

  const options = useMemo(
    () => [
      {
        label: getTextWithFunctionInside(
          t('register-general-condition-1'),
          [() => handleOpenModal(0), t('register-general-condition-2')],
          t('register-general-condition-3'),
        ),
        name: 'preferences.agreeTermsConditions',
      },
      {
        label: getTextWithFunctionInside(
          t('register-privacy-information-1'),
          [() => handleOpenModal(1), t('register-privacy-information-2')],
          t('register-privacy-information-3'),
        ),
        name: 'preferences.agreePrivacyPolicy',
      },
      {
        label: t('register-new-product'),
        name: 'preferences.personalDataProcessing',
      },
    ],
    [t, handleOpenModal],
  );

  const onSubmit = (data: FormRegisterStep3) => {
    const payload: FormRegister = { ...state.createUserForm, ...data };

    actions.updateRegisterForm(data);
    handleCreateUser(payload);
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row gutter={[0, 18]}>
          <Col span={24}>
            <Controller
              as={Input}
              name="password"
              label={t('register-password')}
              control={control}
              type="password"
              error={errors?.password}
              autoFocus
              htmlFor="password"
            />
          </Col>
          <Col span={24}>
            <Controller
              as={Input}
              name="confirmPassword"
              label={t('register-confirm-password')}
              control={control}
              type="password"
              htmlFor="confirm-password"
              error={errors?.confirmPassword}
            />
          </Col>

          <Col span={24}>
            <WrapperCheckbox>
              <Space direction="vertical">
                {options.map((opt) => {
                  const error = opt.name.split('.').reduce((o, i) => o?.[i], errors);

                  return (
                    <Controller key={opt.name} as={Checkbox} name={opt.name} control={control} error={!!error}>
                      {opt.label}
                    </Controller>
                  );
                })}
              </Space>
            </WrapperCheckbox>
          </Col>

          <Col span={24}>
            <Row gutter={18} justify="center">
              <Col>
                <GradientButton onClick={previousStep} noGradient variant="outlined" fullWidth>
                  {t('global-previous')}
                </GradientButton>
              </Col>
              <Col>
                <GradientButton type="submit" fullWidth isLoading={mutationIsLoading}>
                  {t('global-submit')}
                </GradientButton>
              </Col>
            </Row>
          </Col>
        </Row>
      </form>

      {showModal && (
        <Modal
          title={modalInfo.title}
          onCancel={() => setShowModal(false)}
          onOk={() => setShowModal(false)}
          okText={t('global-close')}
          cancelButtonProps={{ style: { display: 'none' } }}
          size="large"
        >
          <SafeHTMLTranslate template={modalInfo.content} Type="p" />
        </Modal>
      )}
    </div>
  );
};

export default styled(ThirdStep)`
  ${({ theme: { colors } }) => css`
    ${InvisibleButton} {
      color: ${colors.baseColor};
      display: inline-block;
    }
  `}
`;

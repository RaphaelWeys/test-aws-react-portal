/* eslint-disable no-underscore-dangle */
import { Alert, Space } from 'antd';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { useCreateUser } from '../../../../endpoints/registration/useCreateUser';
import { BlueStyle } from '../../../../style/utils';
import FirstStep from './FirstStep';
import IndicatorStep from './IndicatorStep';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';
import { FormRegisterStep1 } from './FirstStep/FirstStep';
import { FormRegisterStep2 } from './SecondStep/SecondStep';
import { FormRegisterStep3 } from './ThirdStep/ThirdStep';

interface PropsRegisterForm {
  className?: string;
}

export type FormRegister = FormRegisterStep1 & FormRegisterStep2 & FormRegisterStep3;

const RegisterForm: FC<PropsRegisterForm> = ({ className }) => {
  const [t] = useTranslation();
  const { mutate: createUser, isLoading, error } = useCreateUser();
  const [actualStep, setActualStep] = useState(0);

  const handleCreateUser = React.useCallback(
    (data: FormRegister) => {
      createUser(data);
    },
    [createUser],
  );

  const steps = [
    <FirstStep key={0} nextStep={() => setActualStep(actualStep + 1)} />,
    <SecondStep
      key={1}
      previousStep={() => setActualStep(actualStep - 1)}
      nextStep={() => setActualStep(actualStep + 1)}
    />,
    <ThirdStep
      key={2}
      previousStep={() => setActualStep(actualStep - 1)}
      handleCreateUser={handleCreateUser}
      mutationIsLoading={isLoading}
    />,
  ];

  return (
    <div className={className}>
      <Space direction="vertical" size="large">
        <IndicatorStep nbStep={steps.length} actualStep={actualStep} />

        {error && (
          <Alert
            message={t(`register-alert-error-title-${error}`)}
            description={t(`register-alert-error-description-${error}`)}
            type="error"
            showIcon
            className="register-alert"
            data-testid="alert-registerForm"
          />
        )}

        {steps.filter((step, index) => index === actualStep && step)}

        <BlueStyle>{t('register-information')}</BlueStyle>
      </Space>
    </div>
  );
};

export default styled(RegisterForm)`
  ${BlueStyle} {
    font-weight: normal;
  }

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.sm}) {
      width: 450px;
    }
  `}
`;

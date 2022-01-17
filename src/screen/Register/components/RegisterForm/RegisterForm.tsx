/* eslint-disable no-underscore-dangle */
import { Alert, Space } from 'antd';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { useCreateUser } from '../../../../endpoints/registration/useCreateUser';
import { MainLinkStyle } from '../../../../style/utils';
import FirstStep from './FirstStep';
import IndicatorStep from './IndicatorStep';
import { FormRegister, PropsRegisterForm } from './RegisterForm.interface';
import SecondStep from './SecondStep';
import ThirdStep from './ThirdStep';

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
      nextStep={() => setActualStep(actualStep + 1)}
      previousStep={() => setActualStep(actualStep - 1)}
    />,
    <ThirdStep
      handleCreateUser={handleCreateUser}
      key={2}
      mutationIsLoading={isLoading}
      previousStep={() => setActualStep(actualStep - 1)}
    />,
  ];

  return (
    <div className={className}>
      <Space direction="vertical" size="large">
        <IndicatorStep actualStep={actualStep} nbStep={steps.length} />

        {error && (
          <Alert
            showIcon
            className="register-alert"
            data-testid="alert-registerForm"
            description={t(`register-alert-error-description-${error}`)}
            message={t(`register-alert-error-title-${error}`)}
            type="error"
          />
        )}

        {steps.filter((step, index) => index === actualStep && step)}

        <MainLinkStyle>{t('register-information')}</MainLinkStyle>
      </Space>
    </div>
  );
};

export default styled(RegisterForm)`
  ${MainLinkStyle} {
    font-weight: normal;
  }

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.sm}) {
      width: 450px;
    }
  `}
`;

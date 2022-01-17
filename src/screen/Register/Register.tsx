import { Space } from 'antd';
import { useStateMachine } from 'little-state-machine';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import styled, { css } from 'styled-components';

import InvisibleButton from '../../components/InvisibleButton';
import { useTenant } from '../../context/TenantContext';
import RectangleBox from '../../layout/RectangleBox';
import { Navigation } from '../../navigation';
import history from '../../router/history';
import createUserState from '../../StoreForm/createUserState';
import { updateRegisterForm } from '../../StoreForm/updateState';
import { HeaderOne, TextRegular } from '../../style/utils';
import RegisterForm from './components/RegisterForm';
import { Quotation } from './Register.styled';

interface PropsRegister {
  className?: string;
}

const Register: FC<PropsRegister> = ({ className }) => {
  const [t] = useTranslation();
  const { actions } = useStateMachine({ updateRegisterForm });
  const { isDomainMA } = useTenant();

  const handleClickLogin = useCallback(() => {
    actions.updateRegisterForm(createUserState);
    history.push(Navigation.LOGIN);
  }, [actions]);

  if (isDomainMA) {
    return <Redirect to={Navigation.LOGIN} />;
  }

  return (
    <div className={className}>
      <RectangleBox>
        <Space align="center" direction="vertical" size="large">
          <TextRegular>
            <span>{t('register-have-account')} </span>
            <InvisibleButton onClick={handleClickLogin}>{t('register-connection-link')}</InvisibleButton>
          </TextRegular>

          <HeaderOne>{t('register-title')}</HeaderOne>

          <TextRegular>
            <Quotation>{t('register-subtitle')}</Quotation>
          </TextRegular>

          <RegisterForm />
        </Space>
      </RectangleBox>
    </div>
  );
};

export default styled(Register)`
  ${({ theme: { breakpoints, colors } }) => css`
    width: 90%;
    margin: 0 auto;

    ${InvisibleButton} {
      color: ${colors.baseColor};
      display: inline;
    }

    @media (min-width: ${breakpoints.sm}) {
      width: 820px;
    }
  `}
`;

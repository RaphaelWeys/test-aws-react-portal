import { Space } from 'antd';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import GradientButton from '../../components/GradientButton/GradientButton';
import { useUserInfo } from '../../context/UserInfoContext';
import { useSendEmail } from '../../endpoints/user/useSendEmail';
import { useValidateEmail } from '../../endpoints/user/useValidateEmail';
import MainLayout from '../../layout/MainLayout';
import WrapperWhiteBox from '../../layout/WrapperWhiteBox/WrapperWhiteBox';
import { Navigation } from '../../navigation';
import { TextRegular } from '../../style/utils';
import { getQueryParameters } from '../../utils/url';
import { Error, FailedActivate } from './ConfirmEmail.styled';

interface Props {
  className?: string;
}

const ConfirmEmail: FC<Props> = ({ className }) => {
  const [t] = useTranslation();
  const { userInfo } = useUserInfo();
  const history = useHistory();
  const { token: tokenUrl, userid } = getQueryParameters();
  const {
    mutate: validateEmail,
    isLoading: isLoadingValidate,
    isSuccess: isSuccessValidate,
    error: errorValidate,
  } = useValidateEmail(tokenUrl as string);
  const { mutate: sendEmail, isLoading: isLoadingSendEmail, error: errorSendEmail } = useSendEmail();
  const isEmailValidated = errorValidate?.response?.status || userInfo.validated;

  useEffect(() => {
    if (userInfo.validated) {
      history.push(Navigation.DASHBOARD);
    }
    if (tokenUrl && !userInfo.validated) {
      validateEmail();
    }
    // eslint-disable-next-line
  }, [tokenUrl, validateEmail, userid, userInfo._id, history]);

  const handleResetEmail = (): void => {
    sendEmail((userid as string) || userInfo._id || '');
  };

  return (
    <div className={className}>
      <MainLayout hasBg={false}>
        <WrapperWhiteBox title={t('confirm-email-title')}>
          <Space direction="vertical" size="large">
            {isLoadingValidate && <TextRegular>Trying to activate your account ...</TextRegular>}
            {isSuccessValidate && <TextRegular>{t('confirm-email-success')}</TextRegular>}
            {errorValidate && (
              <FailedActivate>{t(`confirm-email-failed-${errorValidate.response?.status}`)}</FailedActivate>
            )}
            {!isEmailValidated && !tokenUrl && <TextRegular>{t('confirm-email')}</TextRegular>}

            <Space size="middle">
              {!tokenUrl && !isEmailValidated && (
                <GradientButton noGradient isLoading={isLoadingSendEmail} variant="outlined" onClick={handleResetEmail}>
                  {isLoadingSendEmail ? t('confirm-email-resent-pending') : t('confirm-email-resent')}
                </GradientButton>
              )}
              {isEmailValidated && (
                <GradientButton onClick={() => history.push('/')}>{t('global-continue')}</GradientButton>
              )}
            </Space>
            {errorSendEmail && <Error>{t('confirm-email-resent-failed')}</Error>}
          </Space>
        </WrapperWhiteBox>
      </MainLayout>
    </div>
  );
};

export default styled(ConfirmEmail)``;

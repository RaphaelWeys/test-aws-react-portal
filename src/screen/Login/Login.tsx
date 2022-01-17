import { Alert, Col, Row, Space } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import CustomLink from '../../components/CustomLink';
import GradientButton from '../../components/GradientButton';
import { Input } from '../../components/Input';
import InvisibleButton from '../../components/InvisibleButton';
import ModalTermAndCondition from '../../components/Modal/ModalTermAndCondition';
import ForgotPasswordModal from '../../components/Modal/ScreenModal/ForgotPasswordModal';
import { useTenant } from '../../context/TenantContext';
import { useUserInfo } from '../../context/UserInfoContext';
import { useLogin } from '../../endpoints/registration/useLogin';
import useGetFollowApp from '../../hooks/useGetFollowApp';
import useSaveToken from '../../hooks/useSaveToken';
import RectangleBox from '../../layout/RectangleBox';
import { Navigation } from '../../navigation';
import { MainLinkStyle, TextRegular } from '../../style/utils';
import { isClient, isMultiAccess } from '../../utils/behavior';
import { getQueryParameters } from '../../utils/url';
import { FormLogin } from './Login.interface';

interface PropsLogin {
  className?: string;
}

const Login: FC<PropsLogin> = ({ className }) => {
  const [t] = useTranslation();
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { register, handleSubmit, control, errors } = useForm<FormLogin>();
  const { mutate: login, error, isLoading } = useLogin();
  const { isDomainMA } = useTenant();
  const history = useHistory();
  const { setUserInfo } = useUserInfo();
  const { callback } = getQueryParameters();
  const { env, tenantName } = useTenant();
  const [modalTermAndCondition, setModalTermAndCondition] = React.useState(null);
  const followAppUrl = useGetFollowApp();
  const { saveToken } = useSaveToken();

  useEffect(() => {
    register({ name: 'username' }, { required: true });
    register({ name: 'password' }, { required: true });
  }, [register]);

  const handleSuccessLogin = React.useCallback(
    (userInfo) => {
      saveToken(userInfo.token);

      if (callback) {
        window.location.assign(`${callback}`);
        return null;
      }

      if (!userInfo.validated) {
        history.push(`${Navigation.CONFIRM_EMAIL}?userid=${userInfo._id}`);
      } else if (env.REACT_APP_REDIRECT_YOP_ON_LOGIN) window.location.assign(followAppUrl);
      else {
        setUserInfo(userInfo);
        history.push(Navigation.DASHBOARD);
      }
    },
    [callback, env.REACT_APP_REDIRECT_YOP_ON_LOGIN, followAppUrl, history, saveToken, setUserInfo],
  );

  const onSubmit = (data: FormLogin): void => {
    login(
      { ...data, tenant: tenantName },
      {
        onSuccess(userInfo) {
          if (isMultiAccess(userInfo) && isClient(userInfo) && !userInfo?.multiaccess?.conditionsAcceptedByClient) {
            setModalTermAndCondition({
              onSuccess: () => handleSuccessLogin(userInfo),
              userInfo,
            });
          } else {
            handleSuccessLogin(userInfo);
          }
        },
      },
    );
  };

  return (
    <div className={className}>
      <RectangleBox>
        <Space direction="vertical" size="large">
          {!isDomainMA && (
            <TextRegular>
              {t('login-no-account')} <CustomLink to="/register">{t('login-create-account')}</CustomLink>
            </TextRegular>
          )}
          {error && <Alert showIcon message={t(`login-alert-error-${error.response?.status}`)} type="error" />}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space direction="vertical" size="large">
              <Row gutter={[0, 18]}>
                <Col span={24}>
                  <Controller
                    autoFocus
                    as={Input}
                    control={control}
                    error={errors?.username}
                    htmlFor="username"
                    label={t('global-email')}
                    name="username"
                    type="text"
                  />
                </Col>
                <Col span={24}>
                  <Controller
                    as={Input}
                    control={control}
                    error={errors?.password}
                    htmlFor="password"
                    label={t('global-password')}
                    name="password"
                    type="password"
                  />
                </Col>
              </Row>

              <MainLinkStyle>
                <InvisibleButton onClick={() => setShowForgotModal(true)}>
                  {t('login-forgotten-password')}
                </InvisibleButton>
              </MainLinkStyle>
              <GradientButton fullWidth isLoading={isLoading} type="submit">
                {t('login-connection')}
              </GradientButton>
            </Space>
          </form>
        </Space>
      </RectangleBox>

      {showForgotModal && <ForgotPasswordModal toggleModal={() => setShowForgotModal(false)} />}

      {modalTermAndCondition && (
        <ModalTermAndCondition
          handleSuccessLogin={modalTermAndCondition.onSuccess}
          title={t('modal-cgu-rgpd-title')}
          userInfo={modalTermAndCondition.userInfo}
          onClose={() => setModalTermAndCondition(null)}
        />
      )}
    </div>
  );
};

export default styled(Login)`
  width: 28rem;
  margin: 0 auto;
`;

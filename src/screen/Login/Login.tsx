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
import RectangleBox from '../../layout/RectangleBox';
import { Navigation } from '../../navigation';
import { BlueStyle, TextRegular } from '../../style/utils';
import { saveTokenCookies } from '../../utils';
import { isClient, isMultiAccess } from '../../utils/behavior';
import { getQueryParameters } from '../../utils/url';

export type FormLogin = {
  username: string;
  password: string;
} & { tenant?: string };

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

  useEffect(() => {
    register({ name: 'username' }, { required: true });
    register({ name: 'password' }, { required: true });
  }, [register]);

  const handleSuccessLogin = React.useCallback(
    (userInfo) => {
      saveTokenCookies(userInfo.token, env.REACT_APP_SUB_DOMAIN);
      // saveTokenCookies(userInfo.token, 'localhost');

      if (callback) {
        window.location.assign(`${callback}`);
        return null;
      }

      if (!userInfo.validated) {
        history.push(`${Navigation.CONFIRM_EMAIL}?userid=${userInfo._id}`);
      } else {
        if (env.REACT_APP_REDIRECT_YOP_ON_LOGIN) window.location.assign(followAppUrl);
        else {
          setUserInfo(userInfo);
          history.push(Navigation.DASHBOARD);
        }
      }
    },
    [callback, env.REACT_APP_REDIRECT_YOP_ON_LOGIN, env.REACT_APP_SUB_DOMAIN, followAppUrl, history, setUserInfo],
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
          {error && <Alert message={t(`login-alert-error-${error.response?.status}`)} type="error" showIcon />}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Space direction="vertical" size="large">
              <Row gutter={[0, 18]}>
                <Col span={24}>
                  <Controller
                    as={Input}
                    name="username"
                    label={t('global-email')}
                    control={control}
                    type="text"
                    error={errors?.username}
                    htmlFor="username"
                    autoFocus
                  />
                </Col>
                <Col span={24}>
                  <Controller
                    as={Input}
                    name="password"
                    label={t('global-password')}
                    control={control}
                    type="password"
                    htmlFor="password"
                    error={errors?.password}
                  />
                </Col>
              </Row>

              <BlueStyle>
                <InvisibleButton onClick={() => setShowForgotModal(true)}>
                  {t('login-forgotten-password')}
                </InvisibleButton>
              </BlueStyle>
              <GradientButton type="submit" isLoading={isLoading} fullWidth>
                {t('login-connection')}
              </GradientButton>
            </Space>
          </form>
        </Space>
      </RectangleBox>

      {showForgotModal && <ForgotPasswordModal toggleModal={() => setShowForgotModal(false)} />}

      {modalTermAndCondition && (
        <ModalTermAndCondition
          title={t('modal-cgu-rgpd-title')}
          onClose={() => setModalTermAndCondition(null)}
          handleSuccessLogin={modalTermAndCondition.onSuccess}
          userInfo={modalTermAndCondition.userInfo}
        />
      )}
    </div>
  );
};

export default styled(Login)`
  width: 28rem;
  margin: 0 auto;
`;

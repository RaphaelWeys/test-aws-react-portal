import React, { FC } from 'react';
import { Switch, useLocation } from 'react-router-dom';

import { useUserInfo } from '../context/UserInfoContext';
import ReactHelmet from '../components/ReactHelmet';
import { useTenant } from '../context/TenantContext';
import useGetFollowApp from '../hooks/useGetFollowApp';
import { Navigation } from '../navigation/index';
import { getQueryParameters } from '../utils/url';

const AuthenticateApp = React.lazy(() => import('./AuthenticateApp'));
const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'));

const allowedRoute = [
  Navigation.UPDATE_PASSWORD,
  Navigation.TERM_CGU,
  Navigation.TERM_RGPD,
  /^\/multi-access/,
  Navigation.LOGOUT,
];

const Routes: FC = () => {
  const { userInfo } = useUserInfo();
  const followAppUrl = useGetFollowApp();
  const location = useLocation();
  const { env } = useTenant();
  const isAuthenticate = Boolean(userInfo.role);

  React.useEffect(() => {
    const { callback } = getQueryParameters();

    if (callback) {
      localStorage.setItem('callback', callback as string);
    }
  }, []);

  // Make sure the MA user only have access to MA routes
  if (
    isAuthenticate &&
    env.REACT_APP_REDIRECT_YOP_ON_LOGIN &&
    !allowedRoute.find((route) => location.pathname.match(route))
  ) {
    window.location.assign(followAppUrl);
  }

  return (
    <>
      <ReactHelmet />

      <Switch>{isAuthenticate ? <AuthenticateApp /> : <UnauthenticatedApp />}</Switch>
    </>
  );
};

export default Routes;

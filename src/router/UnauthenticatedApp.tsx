import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

import RedirectUser from '../components/RedirectUser';
import { Navigation } from '../navigation';
import Login from '../screen/Login';
import Register from '../screen/Register';
import ResetPassword from '../screen/resetPassword';
import { WrapperNotAuthenticate } from './AuthenticatePage.styled';

const UnAuthenticateLayout: FC = () => (
  <WrapperNotAuthenticate>
    <Switch>
      <Route exact component={Login} path={Navigation.LOGIN} />
      <Route exact component={Register} path={Navigation.REGISTER} />
      <Route exact component={ResetPassword} path={Navigation.RESET_PASSWORD} />
      <Route exact component={RedirectUser} path="*" />
    </Switch>
  </WrapperNotAuthenticate>
);

export default UnAuthenticateLayout;

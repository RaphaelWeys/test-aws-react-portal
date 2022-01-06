import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';

import { Navigation } from '../navigation';
import Login from '../screen/Login';
import Register from '../screen/Register';
import ResetPassword from '../screen/resetPassword';
import { WrapperNotAuthenticate } from './AuthenticatePage.styled';
import RedirectUser from '../components/RedirectUser';

const UnAuthenticateLayout: FC = () => (
  <WrapperNotAuthenticate>
    <Switch>
      <Route exact path={Navigation.LOGIN} component={Login} />
      <Route exact path={Navigation.REGISTER} component={Register} />
      <Route exact path={Navigation.RESET_PASSWORD} component={ResetPassword} />
      <Route exact path="*" component={RedirectUser} />
    </Switch>
  </WrapperNotAuthenticate>
);

export default UnAuthenticateLayout;

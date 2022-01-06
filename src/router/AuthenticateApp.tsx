import React, { FC, useState } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import LogRocket from 'logrocket';

import Header from '../components/Header';
import RedirectUser from '../components/RedirectUser';
import { ScrollProvider } from '../context/ScrollContext';
import { useUserInfo } from '../context/UserInfoContext';
import { useSaveTranslation } from '../endpoints/admin/translation/useSaveTranslation';
import { Navigation } from '../navigation';
import ConfirmEmail from '../screen/confirmEmail';
import Dashboard from '../screen/Dashboard';
import Logout from '../screen/Logout';
import MultiAccessDetails from '../screen/multiAccess/MultiAccessDetail';
import MultiAccessList from '../screen/multiAccess/MultiAccessList';
import PaymentHistory from '../screen/PaymentHistory';
import SignatureRfo from '../screen/SignatureRfo';
import UpdatePassword from '../screen/UpdatePassword';
import { WrapperScroll } from './AuthenticatePage.styled';
import TermCGU from '../screen/TermCGU';
import TermRGPD from '../screen/TermRGPD';
import MultiAccessCreate from '../screen/multiAccess/MultiAccessCreate';
import MultiAccessEdit from '../screen/multiAccess/MultiAccessEdit';

// Only load basket page, when making an order to avoid unnecessary call api Stripe
const BasketWrapper = React.lazy(() => import('../screen/Basket/BasketWrapper'));
const Admin = React.lazy(() => import('../screen/Admin'));

const AuthenticateLayout: FC = () => {
  const { userInfo } = useUserInfo();
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  const { pathname } = useLocation();
  const { mutate: updateTranslations } = useSaveTranslation();

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // @ts-ignore
      LogRocket.identify(`${userInfo._id}`, {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        email: userInfo.username,
        tenant: userInfo.tenant,
        role: userInfo.role,
      });
    }
  }, [userInfo]);

  React.useEffect(() => {
    if (userInfo.validated && userInfo.admin) {
      updateTranslations();
    }
  }, [updateTranslations, userInfo.admin, userInfo.validated]);

  // if account is not validated
  if (!userInfo.validated && pathname !== Navigation.CONFIRM_EMAIL && pathname !== Navigation.LOGOUT) {
    return <Redirect to={Navigation.CONFIRM_EMAIL} />;
  }

  return (
    <>
      {!pathname.includes(Navigation.ADMIN) && <Header />}

      <Switch>
        <Route path={Navigation.ADMIN} component={Admin} />

        <ScrollProvider scroll={scrollRef}>
          <WrapperScroll ref={setScrollRef}>
            <Switch>
              <Route exact path={['/', Navigation.DASHBOARD]} component={Dashboard} />
              <Route exact path={Navigation.BASKET} component={BasketWrapper} />
              <Route exact path={Navigation.PAYMENT_HISTORY} component={PaymentHistory} />
              <Route exact path={Navigation.UPDATE_PASSWORD} component={UpdatePassword} />
              <Route exact path={Navigation.TERM_CGU} component={TermCGU} />
              <Route exact path={Navigation.TERM_RGPD} component={TermRGPD} />

              <Route exact path={Navigation.SIGNATURE} component={SignatureRfo} />

              <Route exact path={Navigation.MULTI_ACCESS} component={MultiAccessList} />
              <Route exact path={Navigation.MULTI_ACCESS_CREATE} component={MultiAccessCreate} />
              <Route exact path={Navigation.MULTI_ACCESS_DETAILS} component={MultiAccessDetails} />
              <Route exact path={Navigation.MULTI_ACCESS_EDIT} component={MultiAccessEdit} />

              <Route exact path={Navigation.CONFIRM_EMAIL} component={ConfirmEmail} />
              <Route exact path={Navigation.LOGOUT} component={Logout} />
              <Route exact path="*" component={RedirectUser} />
            </Switch>
          </WrapperScroll>
        </ScrollProvider>
      </Switch>
    </>
  );
};

export default AuthenticateLayout;

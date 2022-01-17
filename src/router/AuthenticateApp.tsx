import LogRocket from 'logrocket';
import React, { FC, useState } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';

import Header from '../components/Header';
import RedirectUser from '../components/RedirectUser';
import { ScrollProvider } from '../context/ScrollContext';
import { useUserInfo } from '../context/UserInfoContext';
import { useSaveTranslation } from '../endpoints/admin/translation/useSaveTranslation';
import { Navigation } from '../navigation';
import ConfirmEmail from '../screen/confirmEmail';
import Dashboard from '../screen/Dashboard';
import Logout from '../screen/Logout';
import GroupCreate from '../screen/multiAccess/group/GroupCreate';
import GroupDetails from '../screen/multiAccess/group/GroupDetails';
import GroupList from '../screen/multiAccess/group/GroupList';
import MultiAccessCreate from '../screen/multiAccess/MultiAccessCreate';
import MultiAccessDetails from '../screen/multiAccess/MultiAccessDetail';
import MultiAccessEdit from '../screen/multiAccess/MultiAccessEdit';
import MultiAccessList from '../screen/multiAccess/MultiAccessList';
import PaymentHistory from '../screen/PaymentHistory';
import SignatureRfo from '../screen/SignatureRfo';
import TermCGU from '../screen/TermCGU';
import TermRGPD from '../screen/TermRGPD';
import UpdatePassword from '../screen/UpdatePassword';
import { WrapperScroll } from './AuthenticatePage.styled';

// Only load basket page, when making an order to avoid unnecessary call api Stripe
const Basket = React.lazy(() => import('../screen/Basket'));
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
        <Route component={Admin} path={Navigation.ADMIN} />

        <ScrollProvider scroll={scrollRef}>
          <WrapperScroll ref={setScrollRef}>
            <Switch>
              <Route exact component={Dashboard} path={['/', Navigation.DASHBOARD]} />
              <Route exact component={Basket} path={Navigation.BASKET} />
              <Route exact component={PaymentHistory} path={Navigation.PAYMENT_HISTORY} />
              <Route exact component={UpdatePassword} path={Navigation.UPDATE_PASSWORD} />
              <Route exact component={TermCGU} path={Navigation.TERM_CGU} />
              <Route exact component={TermRGPD} path={Navigation.TERM_RGPD} />

              <Route exact component={SignatureRfo} path={Navigation.SIGNATURE} />

              <Route exact component={MultiAccessList} path={Navigation.MULTI_ACCESS} />
              <Route exact component={MultiAccessCreate} path={Navigation.MULTI_ACCESS_CREATE} />
              <Route exact component={MultiAccessDetails} path={Navigation.MULTI_ACCESS_DETAILS} />
              <Route exact component={MultiAccessEdit} path={Navigation.MULTI_ACCESS_EDIT} />

              <Route exact component={GroupList} path={Navigation.GROUP_LIST} />
              <Route exact component={GroupCreate} path={Navigation.GROUP_CREATE} />
              <Route exact component={GroupDetails} path={Navigation.GROUP_DETAILS} />

              <Route exact component={ConfirmEmail} path={Navigation.CONFIRM_EMAIL} />
              <Route exact component={Logout} path={Navigation.LOGOUT} />
              <Route exact component={RedirectUser} path="*" />
            </Switch>
          </WrapperScroll>
        </ScrollProvider>
      </Switch>
    </>
  );
};

export default AuthenticateLayout;

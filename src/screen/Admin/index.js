import AssignmentIcon from '@material-ui/icons/Assignment';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import Description from '@material-ui/icons/Description';
import LocalPlay from '@material-ui/icons/LocalPlay';
import PaymentIcon from '@material-ui/icons/Payment';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import TranslateIcon from '@material-ui/icons/Translate';
import i18next from 'i18next';
import simpleRestProvider from 'ra-data-simple-rest';
import React, { useEffect } from 'react';
import { Admin as ReactAdmin, Resource } from 'react-admin';
import { Redirect } from 'react-router-dom';

import { useUserInfo } from '../../context/UserInfoContext';
import { Navigation } from '../../navigation';
import history from '../../router/history';
import MyLayout from './MyLayout';
import MyLogoutButton from './MyLogoutButton';
import CervedList from './screens/CervedList';
import CouponList from './screens/CouponList';
import OrdersList from './screens/OrdersList';
import RfoList from './screens/RfoList';
import SuppliersList from './screens/SuppliersList';
import TemplateList from './screens/TemplateList';
import TranslationList from './screens/TranslationList';
import UsersList from './screens/UsersList';

export const dataProvider = simpleRestProvider('');
export const authProvider = () => Promise.resolve();

const Admin = () => {
  const { userInfo } = useUserInfo();
  const actualLanguage = i18next.language;

  useEffect(() => {
    if (actualLanguage !== 'en') i18next.changeLanguage('en');
  }, [actualLanguage]);

  if (!userInfo.admin) {
    return <Redirect to={Navigation.DASHBOARD} />;
  }

  return (
    <ReactAdmin
      authProvider={authProvider}
      dataProvider={dataProvider}
      history={history}
      layout={MyLayout}
      logoutButton={MyLogoutButton}
    >
      <Resource
        icon={TranslateIcon}
        list={TranslationList}
        name={Navigation.ADMIN_TRANSLATION}
        options={{ label: 'Translations' }}
      />
      <Resource
        icon={Description}
        list={TemplateList}
        name={Navigation.ADMIN_TEMPLATES}
        options={{ label: 'Templates' }}
      />
      <Resource icon={LocalPlay} list={CouponList} name={Navigation.ADMIN_COUPONS} options={{ label: 'Coupons' }} />
      <Resource icon={SupervisorAccount} list={UsersList} name={Navigation.ADMIN_USERS} options={{ label: 'Users' }} />
      <Resource
        icon={AssignmentIndIcon}
        list={SuppliersList}
        name={Navigation.ADMIN_SUPPLIERS}
        options={{ label: 'Suppliers' }}
      />
      <Resource icon={AssignmentIcon} list={RfoList} name={Navigation.ADMIN_RFOS} options={{ label: 'Rfos' }} />
      <Resource icon={ChildCareIcon} list={CervedList} name={Navigation.ADMIN_CERVED} options={{ label: 'Cerved' }} />
      <Resource icon={PaymentIcon} list={OrdersList} name={Navigation.ADMIN_ORDER} options={{ label: 'Orders' }} />
    </ReactAdmin>
  );
};

export default Admin;

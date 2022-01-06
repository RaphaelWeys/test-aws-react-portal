import Description from '@material-ui/icons/Description';
import LocalPlay from '@material-ui/icons/LocalPlay';
import SupervisorAccount from '@material-ui/icons/SupervisorAccount';
import TranslateIcon from '@material-ui/icons/Translate';
import simpleRestProvider from 'ra-data-simple-rest';
import React, { useEffect } from 'react';
import { Admin as ReactAdmin, Resource } from 'react-admin';
import { Redirect } from 'react-router-dom';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import PaymentIcon from '@material-ui/icons/Payment';
import i18next from 'i18next';

import { useUserInfo } from '../../context/UserInfoContext';
import { Navigation } from '../../navigation';
import MyLayout from './MyLayout';
import CouponList from './screens/CouponList';
import OrdersList from './screens/OrdersList';
import TemplateList from './screens/TemplateList';
import TranslationList from './screens/TranslationList';
import UsersList from './screens/UsersList';
import SuppliersList from './screens/SuppliersList';
import RfoList from './screens/RfoList';
import CervedList from './screens/CervedList';
import history from '../../router/history';

export const dataProvider = simpleRestProvider(process.env.REACT_APP_BACKEND_PORTAL_URL);
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
    <ReactAdmin appLayout={MyLayout} authProvider={authProvider} dataProvider={dataProvider} history={history}>
      <Resource
        options={{ label: 'Translations' }}
        name={Navigation.ADMIN_TRANSLATION}
        list={TranslationList}
        icon={TranslateIcon}
      />
      <Resource
        options={{ label: 'Templates' }}
        name={Navigation.ADMIN_TEMPLATES}
        list={TemplateList}
        icon={Description}
      />
      <Resource options={{ label: 'Coupons' }} name={Navigation.ADMIN_COUPONS} list={CouponList} icon={LocalPlay} />
      <Resource options={{ label: 'Users' }} name={Navigation.ADMIN_USERS} list={UsersList} icon={SupervisorAccount} />
      <Resource
        options={{ label: 'Suppliers' }}
        name={Navigation.ADMIN_SUPPLIERS}
        list={SuppliersList}
        icon={AssignmentIndIcon}
      />
      <Resource options={{ label: 'Rfos' }} name={Navigation.ADMIN_RFOS} list={RfoList} icon={AssignmentIcon} />
      <Resource options={{ label: 'Cerved' }} name={Navigation.ADMIN_CERVED} list={CervedList} icon={ChildCareIcon} />
      <Resource options={{ label: 'Orders' }} name={Navigation.ADMIN_ORDER} list={OrdersList} icon={PaymentIcon} />
    </ReactAdmin>
  );
};

export default Admin;

import React from 'react';

import { useUserInfo } from '../../context/UserInfoContext';
import MultiAccessClientList from './kam/MultiAccessClientList';
import MultiAccessKamList from './manager/MultiAccessKamList';

const MultiAccessList = () => {
  const { userInfo } = useUserInfo();

  return userInfo.role === 'kam' ? (
    <MultiAccessClientList callback={localStorage.getItem('callback')} />
  ) : (
    <MultiAccessKamList callback={localStorage.getItem('callback')} />
  );
};

export default MultiAccessList;

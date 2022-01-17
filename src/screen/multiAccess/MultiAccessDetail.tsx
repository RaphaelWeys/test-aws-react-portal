import React from 'react';

import { useUserInfo } from '../../context/UserInfoContext';
import MultiAccessClientDetails from './kam/MultiAccessClientDetails';
import MultiAccessKamDetails from './manager/MultiAccessKamDetails';

const MultiAccessDetails = () => {
  const { userInfo } = useUserInfo();

  return userInfo.role === 'kam' ? <MultiAccessClientDetails /> : <MultiAccessKamDetails />;
};

export default MultiAccessDetails;

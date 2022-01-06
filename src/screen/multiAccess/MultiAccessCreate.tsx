import React from 'react';

import { useUserInfo } from '../../context/UserInfoContext';
import MultiAccessClientCreate from './kam/MultiAccessClientCreate';
import MultiAccessKamCreateEdit from './manager/MultiAccessKamCreateEdit';

const MultiAccessCreate = () => {
  const { userInfo } = useUserInfo();
  const [currentStep, setCurrentStep] = React.useState(0);

  return userInfo.role === 'kam' ? (
    <MultiAccessClientCreate currentStep={currentStep} setCurrentStep={setCurrentStep} />
  ) : (
    <MultiAccessKamCreateEdit />
  );
};

export default MultiAccessCreate;

import React from 'react';
import { useParams } from 'react-router-dom';

import { useUserInfo } from '../../context/UserInfoContext';
import { useGetMultiAccessUserDetail } from '../../endpoints/multiAccess/useGetMultiAccssUserDetail';
import MultiAccessClientEdit from './kam/MultiAccessClientEdit';
import MultiAccessKamCreateEdit from './manager/MultiAccessKamCreateEdit';

const MultiAccessEdit = () => {
  const { userInfo } = useUserInfo();
  const { userId } = useParams<{ userId: string }>();
  const { data, isLoading } = useGetMultiAccessUserDetail(userId);

  if (isLoading) {
    return null;
  }

  return userInfo.role === 'kam' ? (
    <MultiAccessClientEdit companyName={data.user.company} defaultValues={data.user} />
  ) : (
    <MultiAccessKamCreateEdit defaultValues={data.user} isEditMode />
  );
};

export default MultiAccessEdit;

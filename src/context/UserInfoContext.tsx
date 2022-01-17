import React, { FC, useContext, useState } from 'react';

import { useGetUserInfo } from '../endpoints/user/useGetUserInfo';
import { UserInfo } from '../interface/user';

export interface IInfoUserContext {
  userInfo: Partial<UserInfo>;
  setUserInfo: React.Dispatch<React.SetStateAction<Partial<UserInfo>>>;
}

const UserInfoContext = React.createContext<IInfoUserContext | undefined>(undefined);
UserInfoContext.displayName = 'UserInfoContext';

const UserInfoProvider: FC = ({ children }) => {
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
  const { isFetched, isIdle } = useGetUserInfo(setUserInfo);

  // Prevent to render app, to avoid  unnecessary loading files
  if (!isFetched && !isIdle) {
    return null;
  }

  return <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserInfoContext.Provider>;
};

function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error('useUserInfo must be used within a UserInfoProvider');
  }
  return context;
}

export { UserInfoContext,UserInfoProvider, useUserInfo };

import axios, { AxiosInstance } from 'axios';
import React, { FC, useContext, useMemo } from 'react';

import { useUserInfo } from './UserInfoContext';

const ApiContext = React.createContext<AxiosInstance>(axios);

const ApiProvider: FC = ({ children }) => {
  const { userInfo } = useUserInfo();

  const client = useMemo(() => {
    const instance = axios.create({ baseURL: process.env.REACT_APP_BACKEND_PORTAL_URL });

    if (userInfo.token) {
      instance.defaults.headers.common.Authorization = `Bearer ${userInfo.token}`;
    }

    instance.interceptors.response.use(
      (response) => response,
      (error) => Promise.reject(error),
    );

    return instance;
  }, [userInfo.token]);

  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
};

function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within a ApiProvider');
  }
  return context;
}

export { ApiContext,ApiProvider, useApi };

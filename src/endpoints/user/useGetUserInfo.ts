import React, { useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router';

import useCookie from '../../hooks/useCookie';
import { UserInfo } from '../../interface/user';
import { Navigation } from '../../navigation';
import { useTenant } from '../../context/TenantContext';

export const useGetUserInfo = (setUserInfo: React.Dispatch<React.SetStateAction<Partial<UserInfo>>>) => {
  const { getCookie, removeCookie } = useCookie();
  const tokenName = process.env.REACT_APP_JWT_COOKIE || 'yem_jwt';
  const token = getCookie(tokenName);
  const hasToken = useRef(!!token);
  const history = useHistory();
  const { env } = useTenant();

  return useQuery<UserInfo, AxiosError<UserInfo>>(
    'user-info',
    () =>
      axios
        .get('/users/userinfo', {
          baseURL: process.env.REACT_APP_BACKEND_PORTAL_URL,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data),
    {
      onSuccess(data) {
        setUserInfo(data);
      },
      onError(error) {
        const status = error.response?.status || '';

        if (status === 401 && token) {
          removeCookie(tokenName, { path: '/', domain: env.REACT_APP_SUB_DOMAIN });
          history.push(Navigation.LOGIN);
        }
      },
      enabled: hasToken.current,
    },
  );
};

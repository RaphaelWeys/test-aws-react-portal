import Cookies, { CookieAttributes } from 'js-cookie';
import { useCallback, useMemo } from 'react';

import { useTenant } from '../context/TenantContext';

interface CookieRtrn {
  setCookie: (name: string, value: string, config?: CookieAttributes) => void;
  getCookie: (name?: string) => string | { [key: string]: string } | undefined;
  removeCookie: (name: string, config?: CookieAttributes) => void;
}

const useCookie = (): CookieRtrn => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const { env } = useTenant();

  const defaultConfig = useMemo(
    () => ({
      path: '/',
      domain: env.REACT_APP_SUB_DOMAIN,
    }),
    [env.REACT_APP_SUB_DOMAIN],
  );

  const setCookie = useCallback(
    (name: string, value: string, config?: CookieAttributes) => {
      if (isDevelopment) Cookies.set(name, value);
      else
        Cookies.set(name, value, {
          ...defaultConfig,
          ...config,
        });
    },
    [defaultConfig, isDevelopment],
  );

  const getCookie = useCallback((name?: string) => {
    if (name) return Cookies.get(name);

    return Cookies.get();
  }, []);

  const removeCookie = useCallback(
    (name: string, config?: CookieAttributes): void => {
      if (isDevelopment) Cookies.remove(name);
      else
        Cookies.remove(name, {
          ...defaultConfig,
          ...config,
        });
    },
    [defaultConfig, isDevelopment],
  );

  return { setCookie, getCookie, removeCookie };
};

export default useCookie;

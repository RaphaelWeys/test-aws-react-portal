import Cookies, { CookieAttributes } from 'js-cookie';
import { useCallback } from 'react';

interface CookieRtrn {
  setCookie: (name: string, value: string, options: CookieAttributes) => void;
  getCookie: (name?: string) => string | { [key: string]: string } | undefined;
  removeCookie: (name: string, options?: CookieAttributes) => void;
}

export const TOKEN_NAME = process.env.REACT_APP_JWT_COOKIE || 'yem_jwt';

const useCookie = (): CookieRtrn => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const setCookie = useCallback(
    (name: string, value: string, options: CookieAttributes) => {
      if (isDevelopment) Cookies.set(name, value);
      else Cookies.set(name, value, options);
    },
    [isDevelopment],
  );

  const getCookie = useCallback((name?: string) => {
    if (name) return Cookies.get(name);

    return Cookies.get();
  }, []);

  const removeCookie = useCallback(
    (name: string, options?: CookieAttributes): void => {
      if (isDevelopment) Cookies.remove(name);
      else Cookies.remove(name, options);
    },
    [isDevelopment],
  );

  return { setCookie, getCookie, removeCookie };
};

export default useCookie;

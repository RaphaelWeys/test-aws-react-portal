import Cookies from 'js-cookie';

import { TOKEN_NAME } from '../hooks/useCookie';

export const getCorrectBackend = (backend: string) => {
  switch (backend) {
    case 'follow': {
      return process.env.REACT_APP_BACKEND_FOLLOW_URL;
    }
    case 'tender': {
      return process.env.REACT_APP_BACKEND_TENDER_URL;
    }
    default: {
      return process.env.REACT_APP_BACKEND_PORTAL_URL;
    }
  }
};

export const callAll = (...fns: (((...args: any[]) => void) | undefined)[]) => (...args: any[]) =>
  fns.forEach((fn) => fn && fn(...args));

export const saveTokenCookies = (token, domain) => {
  const month13Later = new Date();
  month13Later.setMonth(month13Later.getMonth() + 13);

  Cookies.set(TOKEN_NAME, token, {
    path: '/',
    domain,
    expires: month13Later,
  });
};

import React from 'react';

import useCookie from './useCookie';

export const TOKEN_NAME = process.env.REACT_APP_JWT_COOKIE || 'yem_jwt';

const useSaveToken = () => {
  const { setCookie } = useCookie();

  const saveToken = React.useCallback(
    (token) => {
      const month13Later = new Date();
      month13Later.setMonth(month13Later.getMonth() + 13);

      setCookie(TOKEN_NAME, token, {
        expires: month13Later,
      });
    },
    [setCookie],
  );

  return { saveToken };
};

export default useSaveToken;

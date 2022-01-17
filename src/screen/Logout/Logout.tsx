import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useTenant } from '../../context/TenantContext';
import { useUserInfo } from '../../context/UserInfoContext';
import useCookie from '../../hooks/useCookie';
import { Navigation } from '../../navigation';

const Logout = () => {
  const { setUserInfo } = useUserInfo();
  const { removeCookie } = useCookie();
  const history = useHistory();
  const { env } = useTenant();

  useEffect(() => {
    const tokenName = process.env.REACT_APP_JWT_COOKIE || 'yem_jwt';

    removeCookie(tokenName, { path: '/', domain: env.REACT_APP_SUB_DOMAIN });
    setUserInfo({});
    history.push(Navigation.LOGIN);
  }, [removeCookie, setUserInfo, history, env.REACT_APP_SUB_DOMAIN]);

  return null;
};

export default Logout;

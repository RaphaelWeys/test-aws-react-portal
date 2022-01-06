import React, { FC } from 'react';

import { useUserInfo } from '../../context/UserInfoContext';
import { Navigation } from '../../navigation';
import history from '../../router/history';

interface Props {
  className?: string;
}

const RedirectUser: FC<Props> = () => {
  const { userInfo } = useUserInfo();
  const isAuthenticate = Boolean(userInfo.role);

  React.useEffect(() => {
    if (isAuthenticate) {
      history.push(Navigation.DASHBOARD);
    } else {
      history.push(Navigation.LOGIN);
    }
  }, [isAuthenticate]);

  return null;
};

export default RedirectUser;

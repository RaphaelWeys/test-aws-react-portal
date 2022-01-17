import MenuItem from '@material-ui/core/MenuItem';
import ExitIcon from '@material-ui/icons/PowerSettingsNew';
import { Space } from 'antd';
import * as React from 'react';
import { forwardRef } from 'react';

import { Navigation } from '../../navigation';
import history from '../../router/history';

const MyLogoutButton = forwardRef((props, ref) => {
  const handleClick = () => {
    history.push(Navigation.DASHBOARD);
  };

  return (
    <MenuItem ref={ref} onClick={handleClick}>
      <Space align="start">
        <ExitIcon /> Exit
      </Space>
    </MenuItem>
  );
});

export default MyLogoutButton;

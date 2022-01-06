import { Menu } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import { MenuInfo } from 'rc-menu/lib/interface';
import React, { FC, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  className?: string;
  defaultValue: string;
  menuItemProps: ({ key: string } & MenuItemProps)[];
  menuProps?: MenuProps;
  customOnClick: (value: string) => void;
}

const HorizontalNavigation: FC<IProps> = ({ className, defaultValue, menuItemProps, customOnClick, menuProps }) => {
  const [current, setCurrent] = useState<string>(defaultValue);

  const handleClick = (e: MenuInfo) => {
    if (typeof e.key === 'string') {
      setCurrent(e.key);
      customOnClick(e.key);
    }
  };

  return (
    <div className={className}>
      <Menu {...menuProps} onClick={handleClick} selectedKeys={[current]} mode="horizontal">
        {menuItemProps.map((item) => (
          <Menu.Item {...item} key={item.key}>
            {item.title}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default styled(HorizontalNavigation)`
  margin-bottom: 15px;
`;

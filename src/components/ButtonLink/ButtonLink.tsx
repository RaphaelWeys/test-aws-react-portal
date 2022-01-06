import React, { FC } from 'react';

import { BlueStyle } from '../../style/utils';
import ArrowBack from '../icons/ArrowBack';
import '../InvisibleButton/InvisibleButton';
import InvisibleButton from '../InvisibleButton';
import ArrowRight from '../icons/ArrowRight';
import styled, { ThemeContext } from 'styled-components';
import { Space } from 'antd';

interface Props {
  className?: string;
  iconPosition?: 'left' | 'right';
  onClick: () => void;
}

const ButtonLink: FC<Props> = ({ className, children, iconPosition = 'right', onClick }) => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <InvisibleButton className={className} onClick={onClick}>
      <BlueStyle>
        <Space>
          {iconPosition === 'left' && <ArrowBack color={themeContext.colors.baseColor} />}
          <span>{children}</span>
          {iconPosition === 'right' && <ArrowRight color={themeContext.colors.baseColor} />}
        </Space>
      </BlueStyle>
    </InvisibleButton>
  );
};

export default styled(ButtonLink)``;

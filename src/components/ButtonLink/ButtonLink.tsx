import '../InvisibleButton/InvisibleButton';

import { Space } from 'antd';
import React, { FC } from 'react';
import styled, { ThemeContext } from 'styled-components';

import { TextColored } from '../../style/utils';
import ArrowBack from '../icons/ArrowBack';
import ArrowRight from '../icons/ArrowRight';
import InvisibleButton from '../InvisibleButton';

interface Props {
  className?: string;
  iconPosition?: 'left' | 'right';
  onClick: () => void;
  color?: string;
}

const ButtonLink: FC<Props> = ({ className, children, iconPosition = 'right', onClick, color }) => {
  const themeContext = React.useContext(ThemeContext);
  const mainColor = color || themeContext.colors.baseColor;

  return (
    <InvisibleButton className={className} onClick={onClick}>
      <TextColored color={mainColor}>
        <Space>
          {iconPosition === 'left' && <ArrowBack color={mainColor} />}
          {children}
          {iconPosition === 'right' && <ArrowRight color={mainColor} />}
        </Space>
      </TextColored>
    </InvisibleButton>
  );
};

export default styled(ButtonLink)``;

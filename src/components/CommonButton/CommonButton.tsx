import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Button } from 'antd';
import { ButtonProps } from 'antd/es/button';

type Props = {
  className?: string;
} & ButtonProps;

const CommonButton: FC<Props> = ({ className, children, ...buttonProps }) => {
  return (
    <Button {...buttonProps} className={className}>
      {children}
    </Button>
  );
};

export default styled(CommonButton)`
  ${({ theme: { colors } }) => css`
    &&& {
      border-radius: 30px;
      background: transparent;
      color: ${colors.baseColor};
      border: 1px solid ${colors.baseColor};
    }
  `}
`;

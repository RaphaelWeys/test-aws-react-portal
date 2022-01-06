import React, { FC } from 'react';
import styled from 'styled-components';
import { LoadingOutlined } from '@ant-design/icons/lib';

import { WrapperGradientButton, WrapperLoading } from './GradientButton.styled';

type Button = React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = {
  className?: string;
  fullWidth?: boolean;
  isLoading?: boolean;
  noButton?: boolean;
  noGradient?: boolean;
  variant?: 'contained' | 'outlined';
} & Button;

const GradientButton: FC<ButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <WrapperGradientButton {...props}>
      {children}
      {isLoading && (
        <WrapperLoading>
          <LoadingOutlined />
        </WrapperLoading>
      )}
    </WrapperGradientButton>
  );
};

export default styled(GradientButton)``;

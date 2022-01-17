import { LoadingOutlined } from '@ant-design/icons/lib';
import React, { FC } from 'react';
import styled from 'styled-components';

import { ButtonProps, WrapperGradientButton, WrapperLoading } from './GradientButton.styled';

const GradientButton: FC<ButtonProps> = ({ children, isLoading, ...props }) => (
  <WrapperGradientButton {...props}>
    {children}
    {isLoading && (
      <WrapperLoading>
        <LoadingOutlined />
      </WrapperLoading>
    )}
  </WrapperGradientButton>
);

export default styled(GradientButton)``;

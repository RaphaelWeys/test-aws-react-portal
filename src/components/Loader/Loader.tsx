import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

interface Props {
  className?: string;
}

const antIcon = <LoadingOutlined spin style={{ fontSize: '6.25rem' }} />;

const Loader: FC<Props> = ({ className }) => (
  <div className={className} data-testid="loader">
    <Spin indicator={antIcon} />
  </div>
);

export default styled(Loader)<{ isAbsolute?: boolean }>`
  ${({ isAbsolute }) => css`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    ${isAbsolute && 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);'}
  `}
`;

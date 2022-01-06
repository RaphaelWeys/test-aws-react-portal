import React, { FC } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import styled, { css } from 'styled-components';

interface Props {
  className?: string;
  isAbsolute?: boolean;
}

const antIcon = <LoadingOutlined style={{ fontSize: '6.25rem' }} spin />;

const Loader: FC<Props> = ({ className }) => {
  return (
    <div className={className} data-testid="loader">
      <Spin indicator={antIcon} />
    </div>
  );
};

export default styled(Loader)<{ isAbsolute?: boolean }>`
  ${({ isAbsolute }) => css`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    ${isAbsolute && 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);'}
  `}
`;

import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import background from '../../assets/background.png';

interface Props {
  className?: string;
}

const MainLayout: FC<Props> = ({ className, children }) => <div className={className}>{children}</div>;

export default styled(MainLayout)<{ hasBg?: boolean }>`
  ${({ hasBg = true, theme: { breakpoints } }) => css`
    ${hasBg && `background: url(${background}) no-repeat top center;`};
    min-height: 100%;
    position: relative;
    width: 100%;
    margin: 0 auto;
    padding: 60px 25px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;

    @media (min-width: ${breakpoints.sm}) {
    }
    @media (min-width: ${breakpoints.lg}) {
      width: 990px;
      padding: 60px 0;
    }
  `}
`;

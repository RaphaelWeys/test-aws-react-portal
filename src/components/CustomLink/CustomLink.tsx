import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface Props {
  className?: string;
  to: string;
}

const CustomLink: FC<Props> = ({ children, className, to }) => (
    <Link className={className} to={to}>
      {children}
    </Link>
  );

export default styled(CustomLink)`
  ${({ theme: { colors } }) => css`
    color: ${colors.baseColor};
    font-weight: 400;
  `}
`;

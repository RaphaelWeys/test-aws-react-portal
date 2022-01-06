import styled, { css } from 'styled-components';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  className?: string;
  to: string;
}

const CustomLink: FC<Props> = ({ children, className, to }) => {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
};

export default styled(CustomLink)`
  ${({ theme: { colors } }) => css`
    color: ${colors.baseColor};
    font-weight: 400;
  `}
`;

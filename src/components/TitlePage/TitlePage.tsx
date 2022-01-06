import React, { FC } from 'react';
import styled from 'styled-components';

export const Title = styled.h1`
  margin: 0 0 3.75rem;
  text-align: center;
  font-size: 2.62rem;
  font-family: 'Fira Sans', sans-serif;
  font-weight: bold;
  color: black;
`;

interface Props {
  className?: string;
}

const TitlePage: FC<Props> = ({ className, children }) => <Title className={className}>{children}</Title>;

export default styled(TitlePage)``;

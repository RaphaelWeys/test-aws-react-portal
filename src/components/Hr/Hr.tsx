import React, { FC } from 'react';
import styled, { css } from 'styled-components';

interface Props {
  className?: string;
}

const Hr: FC<Props> = ({ className }) => <div className={className} />;

export default styled(Hr)<{ noTop?: boolean; noBottom?: boolean }>`
  ${({ theme: { colors }, noTop, noBottom }) => css`
    height: 1px;
    width: 100%;
    border-top: 1px solid ${colors.gray};
    margin-top: ${noTop ? '0' : '25px'};
    margin-bottom: ${noBottom ? '0' : '25px'};
  `}
`;

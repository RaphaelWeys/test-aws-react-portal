import styled, { css } from 'styled-components';

export const Information = styled.span`
  ${({ theme: { colors } }) => css`
    color: ${colors.baseColor};
    font-size: 13px;
    text-align: center;
    display: flex;
  `}
`;

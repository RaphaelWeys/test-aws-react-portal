import styled, { css } from 'styled-components';

export const CircleStep = styled.div<{ isActive: boolean }>`
  ${({ isActive }) => css`
    height: 10px;
    width: 10px;
    background-color: ${isActive ? '#888888' : '#F0EFEF'};
    border-radius: 25px;

    & + & {
      margin-left: 30px;
    }
  `}
`;

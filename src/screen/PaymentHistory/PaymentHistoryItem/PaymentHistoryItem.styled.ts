import styled, { css } from 'styled-components';

export const Icon = styled.div`
  margin-right: 30px;
`;

export const Date = styled.div`
  margin-right: 70px;
`;

export const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  > :first-child {
    font-weight: bold;
    margin-bottom: 9px;
  }

  > :nth-child(2) {
    font-size: 13px;
  }
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.md}) {
      align-items: center;
      flex-direction: row;
    }
  `}
`;

export const CenterPrice = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  align-self: flex-end;

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.sm}) {
      margin-top: 0;
      align-self: auto;
    }
  `}
`;

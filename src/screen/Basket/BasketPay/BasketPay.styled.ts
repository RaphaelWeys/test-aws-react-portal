import styled, { css } from 'styled-components';

export const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.sm}) {
      flex-wrap: nowrap;

      > :first-child {
        margin-bottom: 0;
        margin-right: 1.875rem;
      }
    }
  `}
`;

export const WrapperCardElement = styled.div`
  width: 100%;
  margin-top: 50px;
`;

export const WrapperForm = styled.div`
  width: 100%;
`;

export const SepaText = styled.div`
  margin-top: 20px;
  font-size: 0.8rem;
`;

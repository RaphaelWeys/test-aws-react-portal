import styled, { css } from 'styled-components';

export const WrapperForm = styled.div`
  width: 100%;
`;

export const ContainerButton = styled.div`
  display: flex;
  margin: 30px auto 0;
  width: 100%;

  & > :first-child {
    margin-right: 13px;
  }

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.lg}) {
      width: 388px;
    }
  `}
`;

export const FormStyled = styled.form`
  width: 100%;

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.lg}) {
      width: 550px;
    }
  `}
`;

import styled, { css } from 'styled-components';

export const RFOPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-family: 'Open Sans', sans-serif;

  & + & {
    margin-top: 10px;
  }
`;

export const RFO = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > :nth-child(2) {
    font-size: 0.81rem;
  }
`;

export const Label = styled.div<{ isActive: boolean }>`
  ${({ isActive, theme: { colors } }) => css`
    font-size: 0.81rem;
    color: ${isActive ? '#202124' : colors.baseColor};

    :hover {
      cursor: ${isActive ? 'inherit' : 'pointer'};
    }
  `}
`;

export const PromoCode = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.25rem;
  margin-bottom: 30px;
`;

export const FormStyled = styled.div`
  width: 300px;
`;

export const WrapperInput = styled.div`
  ${({ theme: { colors } }) => css`
    display: flex;
    margin-top: 10px;
    align-items: flex-start;

    > :nth-child(2) {
      margin-left: 13px;
      color: ${colors.baseColor};
      font-size: 13px;
      line-height: 40px;
    }
  `}
`;

export const Divider = styled.div`
  border-top: 1px dashed #000;
  margin-bottom: 30px;
`;

export const TotalLabel = styled.div`
  > :first-child {
    font-weight: bold;
  }
  > :nth-child(2) {
    font-size: 13px;
  }
`;

export const TotalPrice = styled.div`
  font-weight: bold;
`;

export const WrapperTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

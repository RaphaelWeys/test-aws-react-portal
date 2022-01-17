import styled, { css } from 'styled-components';

export const Margin = styled.div<{ mt?: number; mb?: number; ml?: number; mr?: number }>`
  ${({ mt, mb, ml, mr }) => css`
    ${mt && `margin-top: ${mt}px`};
    ${mb && `margin-bottom: ${mb}px`};
    ${ml && `margin-left: ${ml}px`};
    ${mr && `margin-right: ${mr}px`};
  `}
`;

export const DisplayErrorType = styled.div`
  color: red;
  font-size: 0.75rem;
  min-height: 12px;
  width: 100%;
  margin-top: 8px;
  display: flex;
  align-items: center;
`;

export const Error = styled.span`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.extraSmall};
    color: ${colors.red};
  `}
`;

export const BoldBlack = styled.div`
  color: #3c3c3c;
  font-weight: bold;
`;

export const HeaderOne = styled.div`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.header};
    color: ${colors.black};
    font-family: 'Fira Sans', serif;
    font-weight: bold;
  `}
`;

export const HeaderThree = styled.div`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.smallHeader};
    color: ${colors.black};
    font-family: 'Fira Sans', serif;
    font-weight: 600;
  `}
`;

export const TextSmall = styled.div`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.small};
    color: ${colors.grayDark};
  `}
`;

export const TextRegular = styled.div`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.regular};
    color: ${colors.grayDark};
  `}
`;

export const TextRegularBold = styled.div`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.regular};
    color: ${colors.grayDark};
    font-weight: bold;
  `}
`;

export const TextColored = styled.div<{ color: string }>`
  ${({ theme: { fontSize }, color }) => css`
    font-size: ${fontSize.regular};
    color: ${color};
    font-weight: bold;
  `}
`;

export const Label = styled.label`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.regular};
    color: ${colors.black};
    font-weight: 600;
  `}
`;

export const MainLinkStyle = styled.div<{ disabled?: boolean }>`
  ${({ theme: { colors, fontSize }, disabled }) => css`
    font-size: ${fontSize.small};
    color: ${disabled ? colors.gray : colors.baseColor};
    font-weight: bold;
  `}
`;

export const WarningText = styled.div`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.small};
    color: ${colors.orange};
    font-weight: bold;
  `}
`;

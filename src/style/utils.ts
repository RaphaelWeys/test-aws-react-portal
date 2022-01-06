import styled, { css } from 'styled-components';

type IJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type IAlign = 'stretch' | 'center' | 'flex-start' | 'flex-end' | 'baseline' | 'initial' | 'inherit';
type IDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type IDisplay = 'inline-block';

export const AlignItems = styled.div<{
  justify?: IJustify;
  align?: IAlign;
  flex?: boolean;
  noFlexWrap?: boolean;
  space?: number;
  direction?: IDirection;
  bothSideSpace?: boolean;
  display?: IDisplay;
  allSpace?: boolean;
}>`
  ${({
    justify = 'flex-start',
    align = 'center',
    flex = false,
    noFlexWrap = false,
    space = 0,
    direction = 'row',
    bothSideSpace,
    display,
    allSpace,
  }) => css`
    align-items: ${align};
    display: ${display || 'flex'};
    justify-content: ${justify};
    flex-direction: ${direction};
    ${!noFlexWrap && 'flex-wrap: wrap;'};

    > * {
      ${flex && 'flex: 1'};

      ${bothSideSpace
        ? space && (direction === 'row' || direction === 'row-reverse')
          ? `margin-right: ${space / 16}rem; margin-left: ${space / 16}rem`
          : `margin-top: ${space / 16}rem; margin-bottom: ${space / 16}rem`
        : null};

      ${allSpace ? `margin: ${space / 16}rem` : null}
    }
    > * + * {
      ${space && (direction === 'row' || direction === 'row-reverse')
        ? bothSideSpace
          ? `margin-right: ${space / 16}rem; margin-left: ${space / 16}rem`
          : `margin-left: ${space / 16}rem`
        : bothSideSpace
        ? `margin: ${space / 16}rem 0`
        : `margin-top: ${space / 16}rem`};
    }
  `}
`;

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

export const Label = styled.label`
  ${({ theme: { colors, fontSize } }) => css`
    font-size: ${fontSize.regular};
    color: ${colors.black};
    font-weight: 600;
  `}
`;

export const BlueStyle = styled.div<{ disabled?: boolean }>`
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

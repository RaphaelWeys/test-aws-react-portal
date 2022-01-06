import styled, { css } from 'styled-components';

import { ButtonProps } from './GradientButton';

export const WrapperGradientButton = styled.button<ButtonProps>`
  ${({ theme: { fontSize, colors }, noGradient, variant, fullWidth, isLoading, disabled }) => {
    let background = colors.gradientButton;
    let border = 'none';
    let color = colors.white;
    let disabledCss;

    if (noGradient) {
      background = colors.baseColor;
    }

    if (variant === 'outlined') {
      background = colors.white;
      border = `1px solid ${colors.baseColor}`;
      color = colors.baseColor;
    }

    if (disabled) {
      if (variant === 'outlined') {
        disabledCss = css`
          background: ${colors.white};
          border: 1px solid ${colors.white};
          &:hover {
            cursor: default;
          }
        `;
      } else
        disabledCss = css`
          background: ${colors.gray};
          &:hover {
            cursor: default;
          }
        `;
    }

    return css`
      ${fullWidth && 'width: 100%'};
      ${isLoading && 'opacity: 0.6'};
      border-radius: 1.5rem;
      min-width: 8.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      position: relative;
      outline: none;
      padding: 0.56rem 1.625rem;
      font-size: ${fontSize.small};
      background: ${background};
      color: ${color};
      border: ${border};
      transition: 0.2s all;

      &:hover {
        cursor: pointer;
        transform: translate(2px, -2px);
      }

      &:active {
        transform: none;
      }
      ${disabledCss}
    `;
  }}
`;

export const WrapperLoading = styled.div`
  margin-left: 20px;
`;

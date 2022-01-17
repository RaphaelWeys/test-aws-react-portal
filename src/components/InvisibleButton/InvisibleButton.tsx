import React, { ButtonHTMLAttributes, DetailedHTMLProps,FC } from 'react';
import styled, { css } from 'styled-components';

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const InvisibleButton: FC<Props> = ({ children, onClick, className, type = 'button', ...rest }) => (
    <button className={className} type={type} onClick={onClick} {...rest}>
      {children}
    </button>
  );

export default styled(InvisibleButton)`
  ${({ disabled }) =>
    css`
      background-color: transparent;
      border: 0;
      outline: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;

      :hover {
        cursor: ${disabled ? null : 'pointer'};
      }
    `}
`;

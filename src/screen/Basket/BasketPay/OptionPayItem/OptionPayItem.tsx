import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import InvisibleButton from '../../../../components/InvisibleButton';
import { Logo } from './OptionPayItem.styled';

interface Props {
  className?: string;
  icon: string;
  title: string;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

const OptionPayItem: FC<Props> = ({ className, icon, title, text, onClick, disabled }) => (
  <InvisibleButton className={className} disabled={disabled} onClick={onClick}>
    <Logo alt="" src={icon} />
    <h2>{title}</h2>
    <p>{text}</p>
  </InvisibleButton>
);

export default styled(OptionPayItem)<{ isSelected: boolean }>`
  ${({ theme: { colors }, isSelected, disabled }) => css`
    ${disabled && 'border: 1px solid #999999; background-color: #ccccccad; color: #666666; opacity: 0.7'};
    min-height: 18.75rem;
    border: ${isSelected ? `2px solid ${colors.baseColor}` : '1px dashed #a6adb4'};
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.87rem;
    margin-top: 1.875rem;

    h2 {
      margin-bottom: 1.87rem;
    }
  `}
`;

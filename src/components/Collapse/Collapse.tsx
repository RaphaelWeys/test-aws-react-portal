import { Collapse as CollapseAnt } from 'antd';
import { CollapseProps } from 'antd/lib/collapse/Collapse';
import { CollapsePanelProps } from 'antd/lib/collapse/CollapsePanel';
import React, { FC } from 'react';
import styled, { css, ThemeContext } from 'styled-components';

import { Label } from '../../style/utils';
import ArrowRight from '../icons/ArrowRight';

const { Panel } = CollapseAnt;

type Props = {
  className?: string;
  collapseProps?: CollapseProps;
  panelProps?: CollapsePanelProps;
};

const WrapperArrow = styled.div<{ isActive: boolean }>`
  ${({ isActive }) => css`
    svg {
      transform: ${isActive ? 'rotate(90deg)' : 'rotate(0deg)'};
    }
  `}
`;

const Collapse: FC<Props> = ({ className, collapseProps, panelProps, children }) => {
  const themeContext = React.useContext(ThemeContext);

  const getCorrectIcon = React.useCallback(
    ({ isActive }) => (
      <WrapperArrow isActive={isActive}>
        <ArrowRight color={themeContext.colors.baseColor} />
      </WrapperArrow>
    ),
    [themeContext.colors.baseColor],
  );

  return (
    <CollapseAnt className={className} {...collapseProps} expandIcon={getCorrectIcon} expandIconPosition="right">
      <Panel {...panelProps} header={<Label>{panelProps.header}</Label>}>
        {children}
      </Panel>
    </CollapseAnt>
  );
};

export default styled(Collapse)`
  ${({ theme: { colors } }) => css`
    background: ${colors.grayLight};
    border: none;
  `}
`;

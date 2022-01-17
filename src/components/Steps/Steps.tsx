import { Space } from 'antd';
import React, { FC } from 'react';
import styled, { css, ThemeContext } from 'styled-components';

import { MainLinkStyle } from '../../style/utils';

interface Props {
  className?: string;
  currentStep: number;
  steps: {
    icon: React.ReactElement;
    title: string;
  }[];
}

const Steps: FC<Props> = ({ className, steps, currentStep }) => {
  const themeContext = React.useContext(ThemeContext);

  return (
    <div className={className}>
      <Space size={40}>
        {steps.map((step, index) => (
          <MainLinkStyle disabled={currentStep !== index} key={step.title}>
            <Space align="center" direction="vertical">
              {React.cloneElement(step.icon, {
                color: currentStep === index ? themeContext.colors.baseColor : themeContext.colors.gray,
              })}
              {step.title}
            </Space>
          </MainLinkStyle>
        ))}
      </Space>
    </div>
  );
};

export default styled(Steps)`
  ${({ theme: { colors } }) => css`
    padding: 0 12px 20px;
    border-bottom: 1px solid ${colors.gray};
    width: 100%;
  `}
`;

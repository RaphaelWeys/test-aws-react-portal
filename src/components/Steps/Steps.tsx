import React, { FC } from 'react';
import { Space } from 'antd';
import styled, { css, ThemeContext } from 'styled-components';

import { BlueStyle } from '../../style/utils';

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
          <BlueStyle disabled={currentStep !== index} key={step.title}>
            <Space direction="vertical" align="center">
              {React.cloneElement(step.icon, {
                color: currentStep === index ? themeContext.colors.baseColor : themeContext.colors.gray,
              })}
              {step.title}
            </Space>
          </BlueStyle>
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

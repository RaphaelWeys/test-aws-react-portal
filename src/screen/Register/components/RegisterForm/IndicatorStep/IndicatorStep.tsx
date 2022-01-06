import React, { FC } from 'react';
import styled from 'styled-components';

import { CircleStep } from './IndicatorStep.styled';

interface PropsIndicatorStep {
  className?: string;
  nbStep: number;
  actualStep: number;
}

const IndicatorStep: FC<PropsIndicatorStep> = ({ className, nbStep, actualStep }) => {
  return (
    <div className={className}>
      {Array.from({ length: nbStep }).map((_, index) => (
        <CircleStep key={index} isActive={index === actualStep} />
      ))}
    </div>
  );
};

export default styled(IndicatorStep)`
  display: flex;
  justify-content: center;
`;

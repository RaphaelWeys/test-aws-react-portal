import { Radio as RadioAnt } from 'antd';
import { RadioGroupProps } from 'antd/lib/radio/interface';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled from 'styled-components';

import { DisplayErrorType, Label } from '../../../style/utils';
import { callAll } from '../../../utils';
import { getErrorMessage } from '../../../utils/input';

interface Item {
  key: number;
  value: number | string | boolean;
  label: string;
}

type Props = {
  className?: string;
  items: Item[];
  label?: string;
  error?: FieldError;
} & RadioGroupProps;

const Radio: FC<Props> = ({ className, items, label, error, ...input }) => {
  return (
    <div className={className}>
      {label && (
        <div style={{ marginBottom: '18px' }}>
          <Label>{label}</Label>
        </div>
      )}
      <RadioAnt.Group {...input} onChange={(e) => callAll(input.onChange)(e.target.value)}>
        {items.map((item) => (
          <RadioAnt key={item.key} value={item.value}>
            {item.label}
          </RadioAnt>
        ))}
      </RadioAnt.Group>
      {error && <DisplayErrorType>{error && getErrorMessage(error, 'radio')}</DisplayErrorType>}
    </div>
  );
};

export default styled(Radio)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

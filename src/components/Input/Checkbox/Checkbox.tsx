import { Checkbox as CheckboxAnt } from 'antd';
import { CheckboxProps } from 'antd/lib/checkbox';
import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { callAll } from '../../../utils';

type Props = {
  className?: string;
  error?: boolean;
  customOnChange?: (value: boolean) => void;
} & CheckboxProps;

const Checkbox: FC<Props> = ({ className, children, customOnChange, ...input }) => (
  <CheckboxAnt
    className={className}
    {...input}
    checked={input.value}
    onChange={(event) => {
      const isChecked = event.target.checked;

      return callAll(input.onChange, customOnChange)(isChecked);
    }}
  >
    {children}
  </CheckboxAnt>
);

export default styled(Checkbox)`
  ${({ error }) => {
    return css`
      color: #727577;

      > span:last-child {
        font-size: 0.81rem;
      }

      .ant-checkbox-inner {
        ${error && 'border: 1px solid red'};
      }
    `;
  }}
`;

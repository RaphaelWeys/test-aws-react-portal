import { Space, Switch as SwitchAnt, SwitchProps } from 'antd';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';

import { DisplayErrorType, Label } from '../../style/utils';
import { callAll } from '../../utils';
import { getErrorMessage } from '../../utils/input';

interface Props extends SwitchProps {
  className?: string;
  label?: string;
  labelValue: string | React.ReactElement;
  error?: FieldError;
  customOnChange?: (value: boolean) => void;
}

const Switch: FC<Props> = ({ className, label, error, labelValue, customOnChange, ...input }) => (
    <div className={className}>
      {label && (
        <div style={{ marginBottom: '18px' }}>
          <Label>{label}</Label>
        </div>
      )}
      <Space size="middle">
        <SwitchAnt
          {...input}
          // @ts-ignore
          checked={input.value || input.checked}
          onChange={(value) => callAll(input.onChange, customOnChange)(value)}
        />
        <span>{labelValue}</span>
      </Space>
      {error && <DisplayErrorType>{error && getErrorMessage(error, 'switch')}</DisplayErrorType>}
    </div>
  );

export default styled(Switch)`
  ${({ theme: { colors } }) => css`
    min-width: 200px;

    .ant-switch-checked {
      background-color: ${colors.baseColor};
    }
  `}
`;

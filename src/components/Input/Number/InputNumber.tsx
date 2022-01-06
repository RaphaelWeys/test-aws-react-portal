import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';
import { InputNumber as InputNumberAnt } from 'antd';

import { DisplayErrorType, Label } from '../../../style/utils';
import { callAll } from '../../../utils';
import { getErrorMessage } from '../../../utils/input';
import { WrapperInputText } from './InputNumber.styled';
import { InputNumberProps } from 'antd/lib/input-number';
import useDesktop from '../../../hooks/useDesktop';

type Props = {
  className?: string;
  label?: string | React.ReactElement;
  htmlFor?: string;
  customOnChange?: (value: React.ChangeEventHandler<HTMLInputElement>) => void;
  error?: FieldError;
  isPending?: boolean;
} & InputNumberProps;

const InputNumber: FC<Props> = ({ className, label, error, isPending, customOnChange, ...input }) => {
  const isDesktop = useDesktop();

  return (
    <WrapperInputText className={className}>
      {label && (
        <div style={{ marginBottom: '10px' }}>
          <Label>{label}</Label>
        </div>
      )}
      <InputNumberAnt
        onChange={callAll(customOnChange, input.onChange)}
        {...input}
        size={isDesktop ? 'large' : 'middle'}
      />
      {error && (
        <DisplayErrorType data-testid="inputError">{error && getErrorMessage(error, 'number')}</DisplayErrorType>
      )}
    </WrapperInputText>
  );
};

export default styled(InputNumber)`
  ${({ theme: { colors } }) => css`
    .ant-input-number {
      min-width: 70px;
      background: ${colors.whiteDark};
    }
  `}
`;

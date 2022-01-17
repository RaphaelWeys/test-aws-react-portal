import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input/TextArea';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled from 'styled-components';

import { DisplayErrorType, Label } from '../../../style/utils';
import { callAll } from '../../../utils';
import { getErrorMessage } from '../../../utils/input';
import { PositionRelative, WrapperInputText } from './TextArea.styled';

const { TextArea: TextAreaAnt } = Input;

type Props = {
  className?: string;
  label?: string;
  name?: string;
  htmlFor?: string;
  error?: FieldError;
  requiredIcon?: boolean;
  isPending?: boolean;
  customOnChange?: (event: React.ChangeEventHandler<HTMLTextAreaElement>) => void;
} & TextAreaProps;

const TextArea: FC<Props> = ({ className, label, error, customOnChange, ...inputTextArea }) => (
    <WrapperInputText className={className}>
      {label && (
        <div style={{ marginBottom: '10px' }}>
          <Label htmlFor={label}>{label}</Label>
        </div>
      )}
      <PositionRelative>
        <TextAreaAnt {...inputTextArea} onChange={callAll(customOnChange, inputTextArea.onChange)} />
      </PositionRelative>
      <DisplayErrorType data-testid="inputError">{error && getErrorMessage(error, 'text-area')}</DisplayErrorType>
    </WrapperInputText>
  );

export default styled(TextArea)``;

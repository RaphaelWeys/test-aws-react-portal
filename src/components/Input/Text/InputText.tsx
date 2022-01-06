import { InputProps } from 'antd/lib/input';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';

import { Error, Label } from '../../../style/utils';
import { getErrorMessage } from '../../../utils/input';
import {
  InputPasswordStyled,
  InputStyled,
  PositionRelative,
  WrapperInputText,
  WrapperSpinner,
} from './InputText.styled';
import useDesktop from '../../../hooks/useDesktop';
import { LoadingOutlined } from '@ant-design/icons';
import { callAll } from '../../../utils';

type Props = {
  className?: string;
  label?: string;
  htmlFor?: string;
  customOnChange?: (value: React.ChangeEventHandler<HTMLInputElement>) => void;
  error?: FieldError;
  isPending?: boolean;
} & InputProps;

const InputText: FC<Props> = ({ label, className, error, isPending, customOnChange, ...input }) => {
  const isDesktop = useDesktop();
  return (
    <WrapperInputText className={className}>
      {label && (
        <Label>
          <div style={{ marginBottom: '10px' }}>{label}</div>
        </Label>
      )}

      <PositionRelative>
        {input?.type === 'password' ? (
          <InputPasswordStyled {...input} size={isDesktop ? 'large' : 'middle'} />
        ) : (
          <InputStyled
            {...input}
            autoComplete="off"
            size={isDesktop ? 'large' : 'middle'}
            onChange={callAll(customOnChange, input.onChange)}
          />
        )}
        {isPending && (
          <WrapperSpinner>
            <LoadingOutlined />
          </WrapperSpinner>
        )}
      </PositionRelative>
      {error && <Error>{getErrorMessage(error, 'text')}</Error>}
    </WrapperInputText>
  );
};

export default InputText;

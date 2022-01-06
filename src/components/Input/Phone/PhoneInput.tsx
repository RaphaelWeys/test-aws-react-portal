import React, { FC } from 'react';
import RpiPhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import styled, { css } from 'styled-components';

import { Error, Label } from '../../../style/utils';
import { getErrorMessage } from '../../../utils/input';
import { FieldError } from 'react-hook-form';

type Props = {
  className?: string;
  name?: string;
  error: FieldError;
  label?: string;
} & PhoneInputProps;

export const getCountryCode = (country: string | number) => {
  if (typeof country === 'string') {
    if (country === 'en') return 'gb';

    return country;
  }
};

const PhoneInput: FC<Props> = ({ className, error, label, country, ...props }) => (
  <div className={className}>
    {label && (
      <Label>
        <div style={{ marginBottom: '10px' }}>{label}</div>
      </Label>
    )}

    <RpiPhoneInput inputClass="input-class" country={getCountryCode(country)} {...props} />
    {error && <Error data-testid="inputError">{getErrorMessage(error, 'phone')}</Error>}
  </div>
);

export default styled(PhoneInput)`
  ${({ disabled }) => css`
    .special-label {
      display: none;
    }
    .input-class {
      width: 100%;
      height: 40px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px solid #d9d9d9;
      color: ${disabled && 'rgba(0, 0, 0, 0.25)'};
    }
  `}
`;

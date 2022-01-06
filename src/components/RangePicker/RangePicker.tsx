import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import { Moment } from 'moment';
import React from 'react';
import styled, { css } from 'styled-components';

import { callAll } from '../../utils';
import { DisplayErrorType, Label } from '../../style/utils';
import { FieldError } from 'react-hook-form';
import useDesktop from '../../hooks/useDesktop';
import { getErrorMessage } from '../../utils/input';

const { RangePicker: RangePickerAnt } = DatePicker;

type IProps = {
  className?: string;
  customOnChange?: (values: [Moment, Moment] | null, formatString: [string, string]) => void;
  label?: string;
  error?: FieldError;
  errorPosition?: 'bottom' | 'right';
} & RangePickerProps;

const RangePicker = ({ className, customOnChange, label, error, ...input }: IProps) => {
  const isDesktop = useDesktop();

  return (
    <div className={className}>
      {label && (
        <div style={{ marginBottom: '10px' }}>
          <Label>{label}</Label>
        </div>
      )}
      <RangePickerAnt
        {...input}
        onChange={callAll(input.onChange, customOnChange)}
        size={isDesktop ? 'large' : 'middle'}
      />
      {error && <DisplayErrorType>{error && getErrorMessage(error, 'range-picker')}</DisplayErrorType>}
    </div>
  );
};

export default styled(RangePicker)`
  ${({ error, theme: { colors } }) => css`
    .ant-picker {
      background: ${colors.whiteDark};
      ${error && `border: 1px solid ${colors.red}`};
    }
    .ant-picker-range-separator,
    .ant-picker-suffix {
      display: none;
    }
  `}
`;

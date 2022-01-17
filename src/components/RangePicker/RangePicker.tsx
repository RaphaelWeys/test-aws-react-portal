import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker';
import { Moment } from 'moment';
import React from 'react';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';

import useDesktop from '../../hooks/useDesktop';
import { DisplayErrorType, Label } from '../../style/utils';
import { callAll } from '../../utils';
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
        size={isDesktop ? 'large' : 'middle'}
        onChange={callAll(input.onChange, customOnChange)}
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

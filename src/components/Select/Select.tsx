import { Select as SelectAnt } from 'antd';
import { SelectProps } from 'antd/es/select';
import { LabeledValue } from 'antd/lib/select';
import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled, { css } from 'styled-components';

import useDesktop from '../../hooks/useDesktop';
import { Error, Label } from '../../style/utils';
import { callAll } from '../../utils';
import { getErrorMessage } from '../../utils/input';

export interface Item extends Omit<LabeledValue, 'label'> {
  label: string;
}

const { Option } = SelectAnt;

type Props = {
  className?: string;
  label?: string;
  items: Item[];
  error?: FieldError;
  customOnChange?: () => void;
} & SelectProps<string>;

const Select: FC<Props> = ({ className, label, items, error, customOnChange, ...selectProps }) => {
  const isDesktop = useDesktop();

  return (
    <div className={className}>
      {label && (
        <Label>
          <div style={{ marginBottom: '10px' }}>{label}</div>
        </Label>
      )}
      <SelectAnt
        size={isDesktop ? 'large' : 'middle'}
        {...selectProps}
        onChange={callAll(selectProps.onChange, customOnChange)}
      >
        {items.map(({ label, value, ...optionProps }) => (
          <Option key={value} value={value} {...optionProps}>
            {label}
          </Option>
        ))}
      </SelectAnt>
      {error && <Error>{getErrorMessage(error, 'select')}</Error>}
    </div>
  );
};

export default styled(Select)`
  ${({ theme: { colors } }) => css`
    && {
      .ant-select {
        width: 100%;
        border-radius: 4px;
      }
      .ant-select-selector {
        background: ${colors.whiteDark};
      }
    }
  `}
`;

import React, { FC } from 'react';
import { FieldError } from 'react-hook-form';
import styled from 'styled-components';

import europeCountry from '../../constants/europeCountry';
import { useUserInfo } from '../../context/UserInfoContext';
import { DisplayErrorType } from '../../style/utils';
import { getErrorMessage } from '../../utils/input';
import Select from '../Select';

interface Props {
  className?: string;
  label?: string;
  error?: FieldError;
  value?: string;
  placeholder?: string;
}

const SelectCountry: FC<Props> = ({ className, label, error, ...select }) => {
  const { userInfo } = useUserInfo();
  const allCountries = europeCountry[userInfo.language];

  return (
    <div className={className}>
      <Select
        label={label}
        style={{ width: '100%' }}
        {...select}
        showSearch
        items={allCountries.map((country) => ({
          label: country,
          value: country,
        }))}
      />
      {error && <DisplayErrorType>{getErrorMessage(error, 'select-country')}</DisplayErrorType>}
    </div>
  );
};

export default styled(SelectCountry)``;

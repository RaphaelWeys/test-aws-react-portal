import { SelectValue } from 'antd/lib/select';
import React, { FC, useCallback } from 'react';
import styled, { css } from 'styled-components';

import { LANGUAGE_CONFIG } from '../../config/app-config';
import { LocalType } from '../../context/LocalContext';
import { useUserInfo } from '../../context/UserInfoContext';
import { useUpdateLanguage } from '../../endpoints/user/useUpdateLanguage';
import Select from '../Select';

interface Props {
  className?: string;
}

const SelectLang: FC<Props> = ({ className }) => {
  const { userInfo } = useUserInfo();
  const { mutate: updateLang } = useUpdateLanguage();

  const isValidValue = (lang: SelectValue): lang is LocalType => Boolean(LANGUAGE_CONFIG.includes(lang as LocalType));

  const handleChange = useCallback(
    (selectedValue: SelectValue) => {
      if (isValidValue(selectedValue)) {
        updateLang(selectedValue);
      }
    },
    [updateLang],
  );

  return (
    <div className={className}>
      <Select
        bordered={false}
        items={LANGUAGE_CONFIG.map((v) => ({
          value: v,
          label: v.toUpperCase(),
          key: v,
        }))}
        value={userInfo?.language || 'en'}
        onChange={handleChange}
      />
    </div>
  );
};

export default styled(SelectLang)<{ isDesktop?: boolean }>`
  ${({ theme: { colors }, isDesktop }) => css`
    .ant-select-selector {
      background: transparent;

      > .ant-select-selection-item {
        color: ${isDesktop ? colors.headerButton : colors.black};
      }
    }
    .ant-select-arrow .anticon {
      color: ${isDesktop ? colors.headerButton : colors.black};
    }
  `}
`;

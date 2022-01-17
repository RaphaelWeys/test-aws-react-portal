import { Space } from 'antd';
import React, { FC } from 'react';
import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types/form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Error, TextRegularBold } from '../../style/utils';
import Checkbox from '../Input/Checkbox';
import InputNumber from '../Input/Number/InputNumber';
import RangePicker from '../RangePicker/RangePicker';
import Switch from '../Switch/Switch';

interface Props {
  className?: string;
  name: string;
  control: Control<any>;
  errors: any;
  hasCompanyMarketTrend: boolean;
  setValue: any;
  register: any;
  getValues: any;
  country: string;
  energy: string;
  clearErrors: any;
  field: any;
}

const MarketItem: FC<Props> = ({
  className,
  name,
  control,
  errors,
  setValue,
  country,
  energy,
  register,
  getValues,
  clearErrors,
  hasCompanyMarketTrend,
  field,
}) => {
  const [t] = useTranslation();
  const enabled = getValues(`${name}.enabled`);
  const hasCheckboxesError = !!(errors?.marketTrendsPartner || errors?.marketTrendsCompany);

  const validationCheckboxes = React.useCallback(() => {
    const marketTrendsPartner = getValues(`${name}.marketTrendsPartner`);
    const marketTrendsCompany = getValues(`${name}.marketTrendsCompany`);
    const enabled = getValues(`${name}.enabled`);

    if (!enabled) return undefined;

    return marketTrendsPartner || marketTrendsCompany ? undefined : 'true';
  }, [getValues, name]);

  React.useEffect(() => {
    register(`${name}.period`, {
      required: enabled,
      validate: (value) => (!enabled ? undefined : value.length > 0),
    });
    register(`${name}.marketTrendsPartner`, { validate: validationCheckboxes });
    register(`${name}.marketTrendsCompany`, { validate: validationCheckboxes });
    register(`${name}.marketTrendsUser`);
  }, [enabled, name, register, validationCheckboxes]);

  React.useEffect(() => {
    register(`${name}.energy`);
    register(`${name}.country`);
    register(`${name}.contracts`, { required: !!enabled });
  }, [enabled, name, register]);

  React.useEffect(() => {
    setValue(`${name}.energy`, energy);
    setValue(`${name}.country`, country);
  }, [country, energy, name, setValue]);

  const handleChangeCheckboxes = React.useCallback(
    (value) => {
      if (value) {
        clearErrors([`${name}.marketTrendsPartner`, `${name}.marketTrendsCompany`]);
      }
    },
    [clearErrors, name],
  );

  return (
    <Space className={className} direction="vertical" size="middle">
      <Controller
        as={Switch}
        control={control}
        customOnChange={(value) => {
          if (!value) {
            clearErrors([
              `${name}.period`,
              `${name}.contracts`,
              `${name}.marketTrendsPartner`,
              `${name}.marketTrendsCompany`,
            ]);
            setValue(`${name}.period`, undefined);
            setValue(`${name}.marketTrendsPartner`, false);
            setValue(`${name}.marketTrendsCompany`, false);
            setValue(`${name}.marketTrendsUser`, false);
            setValue(`${name}.contracts`, undefined);
          }
        }}
        defaultValue={field.enabled}
        labelValue={
          <TextRegularBold>
            {t(`country-${country}`)} / {t(`global-${energy}`)}
          </TextRegularBold>
        }
        name={`${name}.enabled`}
      />
      <Controller
        as={RangePicker}
        control={control}
        defaultValue={field.period}
        disabled={!enabled}
        error={errors?.period}
        format="L"
        name={`${name}.period`}
      />
      <TextRegularBold>{t('market-item-forecase-type')}</TextRegularBold>
      <Controller
        as={Checkbox}
        control={control}
        customOnChange={handleChangeCheckboxes}
        defaultValue={field.marketTrendsPartner}
        error={hasCheckboxesError}
        name={`${name}.marketTrendsPartner`}
      >
        {t('market-item-partner')}
      </Controller>
      <Space direction="vertical" size="small">
        <Controller
          as={Checkbox}
          control={control}
          customOnChange={handleChangeCheckboxes}
          defaultValue={field.marketTrendsCompany}
          disabled={!hasCompanyMarketTrend}
          error={hasCheckboxesError && hasCompanyMarketTrend}
          name={`${name}.marketTrendsCompany`}
        >
          {t('market-item-company')}
        </Controller>

        {hasCheckboxesError && <Error>{t('market-item-no-checkboxes-selected')}</Error>}
      </Space>
      <Controller
        as={Checkbox}
        control={control}
        defaultValue={field.marketTrendsUser}
        name={`${name}.marketTrendsUser`}
      >
        {t('market-item-user')}
      </Controller>
      <Controller
        as={InputNumber}
        control={control}
        defaultValue={field.contracts}
        error={errors?.contracts}
        label={<TextRegularBold>{t('market-item-number-contracts')}</TextRegularBold>}
        min={1}
        name={`${name}.contracts`}
      />
    </Space>
  );
};

export default styled(MarketItem)`
  padding: 1.5rem;
  border: 1px solid #ced5db;
`;

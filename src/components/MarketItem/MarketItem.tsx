import React, { FC } from 'react';
import styled from 'styled-components';
import { Controller } from 'react-hook-form';
import Switch from '../Switch/Switch';
import { Control } from 'react-hook-form/dist/types/form';
import RangePicker from '../RangePicker/RangePicker';
import Checkbox from '../Input/Checkbox';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { Error, TextRegularBold } from '../../style/utils';
import InputNumber from '../Input/Number/InputNumber';

interface Props {
  className?: string;
  name: string;
  control: Control<any>;
  customOnChange?: (value: boolean) => void;
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
        name={`${name}.enabled`}
        as={Switch}
        control={control}
        labelValue={
          <TextRegularBold>
            {t(`country-${country}`)} / {t(`global-${energy}`)}
          </TextRegularBold>
        }
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
      />
      <Controller
        name={`${name}.period`}
        as={RangePicker}
        control={control}
        format="L"
        error={errors?.period}
        disabled={!enabled}
        defaultValue={field.period}
      />
      <TextRegularBold>{t('market-item-forecase-type')}</TextRegularBold>
      <Controller
        defaultValue={field.marketTrendsPartner}
        name={`${name}.marketTrendsPartner`}
        as={Checkbox}
        control={control}
        error={hasCheckboxesError}
        customOnChange={handleChangeCheckboxes}
      >
        {t('market-item-partner')}
      </Controller>
      <Space direction="vertical" size="small">
        <Controller
          defaultValue={field.marketTrendsCompany}
          name={`${name}.marketTrendsCompany`}
          as={Checkbox}
          control={control}
          disabled={!hasCompanyMarketTrend}
          error={hasCheckboxesError && hasCompanyMarketTrend}
          customOnChange={handleChangeCheckboxes}
        >
          {t('market-item-company')}
        </Controller>

        {hasCheckboxesError && <Error>{t('market-item-no-checkboxes-selected')}</Error>}
      </Space>
      <Controller
        defaultValue={field.marketTrendsUser}
        name={`${name}.marketTrendsUser`}
        as={Checkbox}
        control={control}
      >
        {t('market-item-user')}
      </Controller>
      <Controller
        name={`${name}.contracts`}
        defaultValue={field.contracts}
        as={InputNumber}
        min={1}
        control={control}
        label={<TextRegularBold>{t('market-item-number-contracts')}</TextRegularBold>}
        error={errors?.contracts}
      />
    </Space>
  );
};

export default styled(MarketItem)`
  padding: 1.5rem;
  border: 1px solid #ced5db;
`;

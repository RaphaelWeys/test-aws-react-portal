import { Col, Row, Space } from 'antd';
import moment from 'moment';
import React, { FC } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Hr from '../../../../components/Hr';
import Radio from '../../../../components/Input/Radio';
import MarketItem from '../../../../components/MarketItem';
import SafeHTMLTranslate from '../../../../components/SafeHTMLTranslate';
import { MANAGED_BY } from '../../../../constants';
import { ClientMarkets } from '../../../../interface/multiAccess';
import { Error, Label, TextRegular } from '../../../../style/utils';
import { isBoolean } from '../../../../utils/behavior';
import { getErrorMessage } from '../../../../utils/input';

interface Props {
  marketList?: ClientMarkets[];
}

const FormStep2: FC<Props> = ({ marketList }) => {
  const [t] = useTranslation();
  const { control, register, errors, clearErrors, watch, setValue, getValues } = useFormContext();
  const { fields } = useFieldArray({ name: 'multiaccess.clientMarkets' });
  const { multiaccess } = watch();

  React.useEffect(() => {
    if (multiaccess.clientCanLogin) {
      setValue(
        'multiaccess.clientMarkets',
        marketList.map((market) => ({
          contracts: market.contracts || undefined,
          country: market.country,
          enabled: market.enabled || false,
          energy: market.energy,
          marketTrendsPartner: market.marketTrendsPartner || false,
          marketTrendsCompany: market.marketTrendsCompany || false,
          marketTrendsUser: market.marketTrendsUser || false,
          hasCompanyMarketTrend: market.hasCompanyMarketTrend,
          period: market.periodStart
            ? [moment(market.periodStart, 'YYYY-MM-DD'), moment(market.periodEnd, 'YYYY-MM-DD')]
            : [],
        })),
      );
    }
  }, [getValues, marketList, multiaccess.clientCanLogin, setValue]);

  React.useEffect(() => {
    register(
      { name: 'multiaccess.clientCanLogin' },
      { validate: (value) => (!isBoolean(value) ? 'global-field-required' : null) },
    );
  }, [register]);

  React.useEffect(() => {
    if (multiaccess.clientCanLogin) {
      register({ name: 'multiaccess.contractsManagedBy' }, { required: true });
    }
  }, [multiaccess.clientCanLogin, register]);

  const AccessToolRadio = React.useMemo(
    () => [
      { key: 0, value: false, label: t('multi-access-edit-manage-kam-step-2') },
      { key: 1, value: true, label: t('multi-access-edit-manage-client-step-2') },
    ],
    [t],
  );

  const ManagementRadio = React.useMemo(
    () => [
      { key: 0, value: MANAGED_BY.KAM, label: t('multi-access-edit-manage-kam-by-kam') },
      { key: 1, value: MANAGED_BY.CLIENT, label: t('multi-access-edit-manage-kam-by-client') },
    ],
    [t],
  );

  return (
    <>
      <Controller
        as={Radio}
        control={control}
        error={errors?.multiaccess?.clientCanLogin}
        items={AccessToolRadio}
        label={t('multi-access-edit-is-manage-kam-step-2')}
        name="multiaccess.clientCanLogin"
      />

      <Hr />

      {multiaccess.clientCanLogin && (
        <>
          <Row>
            <Col xs={24}>
              <Controller
                as={Radio}
                control={control}
                error={errors?.multiaccess?.contractsManagedBy}
                items={ManagementRadio}
                label={t('multi-access-edit-who-can-manage-contract')}
                name="multiaccess.contractsManagedBy"
              />
            </Col>
          </Row>

          <Hr />

          <div style={{ marginBottom: '18px' }}>
            <Space direction="vertical">
              <Label>
                <SafeHTMLTranslate template="multi-access-edit-explain1-info" />
              </Label>
              <TextRegular>
                <SafeHTMLTranslate template="multi-access-edit-explain2-info" />
              </TextRegular>
            </Space>
          </div>

          <Row gutter={[40, 20]}>
            {fields.map((field, index) => (
              <Col className="gutter-row" key={field.id} md={8} sm={12} xs={24}>
                <MarketItem
                  clearErrors={clearErrors}
                  control={control}
                  country={field.country}
                  energy={field.energy}
                  errors={errors?.multiaccess?.clientMarkets?.[index]}
                  field={field}
                  getValues={getValues}
                  hasCompanyMarketTrend={field.hasCompanyMarketTrend}
                  name={`multiaccess.clientMarkets[${index}]`}
                  register={register}
                  setValue={setValue}
                />
              </Col>
            ))}
          </Row>

          {errors?.multiaccess?.clientMarkets?.message && (
            <Error>{getErrorMessage(errors.multiaccess.clientMarkets)}</Error>
          )}

          <Hr />
        </>
      )}
    </>
  );
};

export default FormStep2;

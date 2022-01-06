import { useTranslation } from 'react-i18next';
import React, { FC } from 'react';
import { Col, Row, Space } from 'antd';
import moment from 'moment';
import { useParams } from 'react-router-dom';

import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import MainLayout from '../../../../layout/MainLayout/MainLayout';
import { HeaderOne, TextRegular } from '../../../../style/utils';
import Collapse from '../../../../components/Collapse';
import logoCompany from '../../../../assets/picto-compte-entreprise.svg';
import GradientButton from '../../../../components/GradientButton';
import FormStep1 from '../FormStep1';
import { FormProvider, useForm } from 'react-hook-form';
import FormStep2 from '../FormStep2';
import { MultiAccessClientUser } from '../../../../interface/multiAccess';
import { useUpdateMultiAccessUser } from '../../../../endpoints/multiAccess/useUpdateMultiAccessUser';
import { hasSomeClientMarketActivated } from '../../utils';
import { useGetMarketList } from '../../../../endpoints/multiAccess/useGetMarketList';
import useGetPortalApp from '../../../../hooks/useGetPortalApp';
import history from '../../../../router/history';
import { Navigation } from '../../../../navigation/index';

interface Props {
  defaultValues: MultiAccessClientUser;
  companyName: string;
}

export interface ClientMarketsForm {
  country: string;
  energy: string;
  enabled: boolean;
  period: string[];
  marketTrendsPartner: boolean;
  marketTrendsCompany: boolean;
  marketTrendsUser: boolean;
  contracts: number;
}

export interface MultiAccessMultiAccessForm {
  clientReference?: string;
  isDailyAccount: boolean;
  contractsManagedBy: 'kam' | 'client';
  clientCanLogin: boolean;
  contracts: number;
  clientMarkets: ClientMarketsForm[];
}

export interface MultiAccessForm {
  phone: string;
  company: string;
  firstName: string;
  lastName: string;
  username: string;
  multiaccess: MultiAccessMultiAccessForm;
}

const MultiAccessClientEdit: FC<Props> = ({ defaultValues, companyName }) => {
  const [t] = useTranslation();
  const portalAppUrl = useGetPortalApp();
  const { data: marketList } = useGetMarketList();
  const methods = useForm({
    defaultValues: {
      ...defaultValues,
      multiaccess: {
        ...defaultValues.multiaccess,
        clientMarkets: defaultValues.multiaccess?.clientMarkets?.map((market) => ({
          contracts: market.contracts || undefined,
          country: market.country,
          enabled: market.enabled || false,
          energy: market.energy,
          marketTrendsPartner: market.marketTrendsPartner || false,
          marketTrendsCompany: market.marketTrendsCompany || false,
          marketTrendsUser: market.marketTrendsUser || false,
          period: market.periodStart
            ? [moment(market.periodStart, 'YYYY-MM-DD'), moment(market.periodEnd, 'YYYY-MM-DD')]
            : [],
        })),
      },
    },
  });
  const { userId } = useParams<{ userId: string }>();
  const { mutate: updateClient, isLoading } = useUpdateMultiAccessUser(userId);

  const backToDetails = React.useCallback(() => {
    history.push(Navigation.MULTI_ACCESS_DETAILS.replace(':userId', userId));
  }, [userId]);

  const marketListFormatted = React.useMemo(() => {
    if (!marketList) {
      return [];
    }

    return marketList.map((ml) => {
      let existingMarket;

      if (defaultValues.multiaccess.clientMarkets)
        existingMarket = defaultValues.multiaccess.clientMarkets.find(
          (cl) => cl.country === ml.country && cl.energy === ml.energy,
        );

      if (existingMarket) return { ...existingMarket, hasCompanyMarketTrend: ml.hasCompanyMarketTrend };

      return ml;
    });
  }, [defaultValues.multiaccess.clientMarkets, marketList]);

  const onSubmit = React.useCallback(
    (data: MultiAccessForm) => {
      if (data.multiaccess.clientCanLogin && !hasSomeClientMarketActivated(data.multiaccess.clientMarkets)) {
        methods.setError('multiaccess.clientMarkets', { message: 'register-client-marker-error' });
      } else {
        updateClient(
          {
            ...data,
            phone: data.phone.replace(/\+*/, '+'),
            confirmEmailUrl: `${portalAppUrl}/confirmEmail`,
            multiaccess: data.multiaccess.clientCanLogin
              ? {
                  ...defaultValues.multiaccess,
                  ...data.multiaccess,
                  // Extract `period`, to not sent it in the payload
                  clientMarkets: data.multiaccess?.clientMarkets?.map(({ period, ...market }) => ({
                    ...market,
                    periodStart: market.enabled ? moment(period[0]).format('YYYY-MM-DD') : undefined,
                    periodEnd: market.enabled ? moment(period[1]).format('YYYY-MM-DD') : undefined,
                  })),
                  clientCanLogin: true,
                }
              : {
                  ...data.multiaccess,
                  ...defaultValues.multiaccess,
                  clientMarkets: defaultValues.multiaccess?.clientMarkets?.map((market) => ({
                    ...market,
                    periodStart: market.enabled ? market.periodStart : undefined,
                    periodEnd: market.enabled ? market.periodEnd : undefined,
                  })),
                  clientCanLogin: false,
                },
          },
          {
            onSuccess() {
              backToDetails();
            },
          },
        );
      }
    },
    [backToDetails, defaultValues.multiaccess, methods, portalAppUrl, updateClient],
  );

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox>
        <Space direction="vertical" size="middle">
          <Space size="middle">
            <img src={logoCompany} alt="logo" />
            <HeaderOne>{companyName}</HeaderOne>
          </Space>

          <TextRegular>{t('multi-access-edit-client-account')}</TextRegular>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Space direction="vertical" size={0}>
                <Row gutter={[0, 25]}>
                  <Col span={24}>
                    <Collapse
                      collapseProps={{ defaultActiveKey: [0] }}
                      panelProps={{ key: 0, header: t('multi-access-user-information-title') }}
                    >
                      <FormStep1 />
                    </Collapse>
                  </Col>
                  <Col span={24}>
                    <Collapse
                      collapseProps={{ defaultActiveKey: [0] }}
                      panelProps={{ key: 0, header: t('multi-access-contract-optimization-title') }}
                    >
                      <FormStep2 marketList={marketListFormatted} />
                    </Collapse>
                  </Col>
                </Row>

                <Space size="middle">
                  <GradientButton onClick={() => backToDetails()} variant="outlined">
                    {t('global-cancel')}
                  </GradientButton>
                  <GradientButton type="submit" isLoading={isLoading}>
                    {t('global-modify')}
                  </GradientButton>
                </Space>
              </Space>
            </form>
          </FormProvider>
        </Space>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default MultiAccessClientEdit;

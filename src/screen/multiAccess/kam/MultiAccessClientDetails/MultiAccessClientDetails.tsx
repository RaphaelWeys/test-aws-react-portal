import { Col, Row, Space } from 'antd';
import moment from 'moment';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ThemeContext } from 'styled-components';
import ButtonLink from '../../../../components/ButtonLink';
import Collapse from '../../../../components/Collapse';
import GradientButton from '../../../../components/GradientButton';
import ArrowRight from '../../../../components/icons/ArrowRight';
import CompanyIcon from '../../../../components/icons/CompanyIcon';
import ModalDeleteMultiAccess from '../../../../components/Modal/ModalDeleteMultiAccess';
import ModalTransfersAccount from '../../../../components/Modal/ModalTransfersAccount';
import Table from '../../../../components/Table';
import { MANAGED_BY } from '../../../../constants';
import { useGetCanDeleteUser } from '../../../../endpoints/multiAccess/useGetCanDeleteUser';
import { useGetKamContractList } from '../../../../endpoints/multiAccess/useGetKamContractList';
import { useGetMultiAccessUserDetail } from '../../../../endpoints/multiAccess/useGetMultiAccssUserDetail';
import useGetFollowApp from '../../../../hooks/useGetFollowApp';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import history from '../../../../router/history';
import { Label, TextRegular, TextRegularBold, WarningText } from '../../../../style/utils';

const MultiAccessClientDetails: FC = () => {
  const [t] = useTranslation();
  const followAppUrl = useGetFollowApp();
  const [showModalTransfers, setShowModalTransfers] = React.useState(false);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const { userId } = useParams<{ userId: string }>();
  const themeContext = React.useContext(ThemeContext);
  const { data, isLoading } = useGetMultiAccessUserDetail(userId);
  const { data: kamContractList, isLoading: isKamContractListLoading } = useGetKamContractList(userId);
  const { data: canDeleteUser } = useGetCanDeleteUser(userId);

  const header = React.useMemo(
    () => [
      {
        title: t('multi-access-name-contract-title'),
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: t('multi-access-optimized-contract-title'),
        dataIndex: 'optimized',
        key: 'optimized',
        width: '69%',
        sorter: (a, b) => {
          if (a.optimized && !b.optimized) {
            return -1;
          } else if (!a.optimized && b.optimized) {
            return 1;
          }

          return b.name.localeCompare(a.name);
        },
        render: (optimized) =>
          optimized ? (
            t(`multi-access-optimized-contract-true`)
          ) : (
            <WarningText>{t('multi-access-optimized-contract-false')}</WarningText>
          ),
      },
      {
        key: 'arrow',
        width: '1%',
        render: () => <ArrowRight color={themeContext.colors.baseColor} />,
      },
    ],
    [t, themeContext.colors.baseColor],
  );

  const dataSource = React.useMemo(() => {
    if (!kamContractList) return [];

    return kamContractList.map((item) => ({
      ...item,
      key: item.id,
    }));
  }, [kamContractList]);

  const managementClientAccess = React.useMemo(() => {
    if (!data) {
      return null;
    }
    const { user } = data;

    const info = [
      {
        title: user.multiaccess.clientCanLogin
          ? t('multi-access-user-management-client-access-true')
          : t('multi-access-user-management-client-access-false'),
      },
    ];

    if (user.multiaccess.clientCanLogin) {
      info.push({
        title:
          user.multiaccess.contractsManagedBy === MANAGED_BY.KAM
            ? t('multi-access-user-management-contract-kam')
            : t('multi-access-user-management-contract-client'),
      });
    }

    return info;
  }, [data, t]);

  const markerList = React.useMemo(() => {
    if (!data) {
      return null;
    }
    const { multiaccess } = data.user;

    return multiaccess.clientMarkets
      ?.filter((info) => info.enabled)
      .map((market) => {
        if (!market.enabled) {
          return null;
        }
        const forecastType = [];

        if (market.marketTrendsPartner) forecastType.push(t('market-item-partner'));
        if (market.marketTrendsCompany) forecastType.push(t('market-item-company'));
        if (market.marketTrendsUser) forecastType.push(t('market-item-user'));

        return (
          <Space direction="vertical" size={0}>
            <TextRegularBold>
              {t(`country-${market.country}`)} / {t(`global-${market.energy}`)}
            </TextRegularBold>
            <TextRegular>
              {t('market-list-start')} {moment(market.periodStart, 'YYYY-MM-DD').format('L')}
            </TextRegular>
            <TextRegular>
              {t('market-list-end')} {moment(market.periodEnd, 'YYYY-MM-DD').format('L')}
            </TextRegular>
            <TextRegularBold>{t('market-list-forecast-type')}</TextRegularBold>
            <TextRegular>{forecastType.join(' / ')}</TextRegular>
            <TextRegularBold>{t('market-list-maximum-contract')}</TextRegularBold>
            <TextRegular>{market.contracts}</TextRegular>
          </Space>
        );
      });
  }, [data, t]);

  const marketForecast = React.useMemo(() => {
    if (!data) {
      return null;
    }
    return [{ title: t('multi-access-user-market-forecast'), data: markerList }];
  }, [data, markerList, t]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <MainLayout hasBg={false}>
        <WrapperWhiteBox
          backButtonText="multi-access-all-acount-client"
          to={Navigation.MULTI_ACCESS}
          icon={<CompanyIcon />}
          title={data.user.company}
          extra={
            <GradientButton onClick={() => history.push(Navigation.MULTI_ACCESS_EDIT.replace(':userId', userId))}>
              {t('multi-access-list-modify-client')}
            </GradientButton>
          }
        >
          <Space direction="vertical" size={25}>
            <Row gutter={[0, 25]}>
              <Col span={24}>
                <Collapse
                  collapseProps={{ defaultActiveKey: [0] }}
                  panelProps={{ key: 0, header: t('multi-access-user-information-title') }}
                >
                  <Space direction="vertical">
                    <Row gutter={[25, 20]}>
                      <Col xs={24} sm={7}>
                        <Space direction="vertical" size="middle">
                          <Label>{t('multi-access-user-contact-title')}</Label>
                          <div>
                            <TextRegular>
                              {data.user.firstName} / {data.user.lastName}
                            </TextRegular>
                            <TextRegular>{data.user.phone}</TextRegular>
                          </div>
                        </Space>
                      </Col>
                      {data.user.multiaccess.clientReference && (
                        <Col xs={24} sm={7}>
                          <Space direction="vertical" size="middle">
                            <Label>{t('multi-access-user-reference-client')}</Label>
                            <div>
                              <TextRegular>{data.user.multiaccess.clientReference}</TextRegular>
                            </div>
                          </Space>
                        </Col>
                      )}
                    </Row>
                    <a href={`mailto:${data.user.username}`}>
                      <ButtonLink onClick={null}>{data.user.username}</ButtonLink>
                    </a>
                  </Space>
                </Collapse>
              </Col>
              <Col span={24}>
                <Collapse
                  collapseProps={{ defaultActiveKey: [0] }}
                  panelProps={{ key: 0, header: t('multi-access-user-management-client-access') }}
                >
                  <Space direction="vertical" size="middle">
                    <Row gutter={[25, 20]}>
                      {managementClientAccess.map((item, index) => (
                        <Col span={24} key={index}>
                          <Space direction="vertical" size="middle">
                            <Label>{item.title}</Label>
                          </Space>
                        </Col>
                      ))}
                    </Row>
                    {data.user.multiaccess.clientCanLogin && (
                      <Row>
                        {marketForecast.map((item, index) => (
                          <Col xs={24} key={index}>
                            <Space direction="vertical" size="middle">
                              <Label>{item.title}</Label>
                              <Row>
                                {item.data.map((info, index) => (
                                  <Col xs={24} md={8} key={index}>
                                    {info}
                                  </Col>
                                ))}
                              </Row>
                            </Space>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Space>
                </Collapse>
              </Col>
              <Col span={24}>
                <Collapse
                  collapseProps={{ defaultActiveKey: [0] }}
                  panelProps={{ key: 0, header: t('multi-access-contract-title') }}
                >
                  <Table
                    columns={header}
                    loading={isKamContractListLoading}
                    dataSource={dataSource}
                    rowKey={(record) => record.id}
                    showSorterTooltip={false}
                    onRow={(record) => {
                      return {
                        onClick: () => {
                          window.location.assign(
                            `${followAppUrl}${Navigation.CONTRACTS_DETAILS.replace(':id', record.id)}`,
                          );
                        },
                      };
                    }}
                  />
                </Collapse>
              </Col>
            </Row>

            <Space size="large">
              <ButtonLink onClick={() => setShowModalTransfers(true)}>{t('multi-access-transfert-account')}</ButtonLink>
              {canDeleteUser?.canDelete && (
                <ButtonLink onClick={() => setShowModalDelete(true)}>{t('multi-access-delete-account')}</ButtonLink>
              )}
            </Space>
          </Space>
        </WrapperWhiteBox>
      </MainLayout>

      {showModalTransfers && (
        <ModalTransfersAccount
          onClose={() => setShowModalTransfers(false)}
          userId={data.user.id}
          title={`${data.user.company} - ${data.user.firstName} ${data.user.lastName}`}
        />
      )}
      {showModalDelete && (
        <ModalDeleteMultiAccess
          userId={data.user._id}
          onClose={() => setShowModalDelete(false)}
          canDelete
          companyName={data.user.company}
          firstName={data.user.firstName}
          lastName={data.user.lastName}
        />
      )}
    </>
  );
};

export default MultiAccessClientDetails;

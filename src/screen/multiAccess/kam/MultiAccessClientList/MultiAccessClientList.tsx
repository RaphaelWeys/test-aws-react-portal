import { Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ThemeContext } from 'styled-components';

import GradientButton from '../../../../components/GradientButton';
import Hr from '../../../../components/Hr';
import ArrowRight from '../../../../components/icons/ArrowRight';
import CompanyIcon from '../../../../components/icons/CompanyIcon';
import Search from '../../../../components/Input/Search';
import SafeHTMLTranslate from '../../../../components/SafeHTMLTranslate';
import Table from '../../../../components/Table';
import { useGetContractCount } from '../../../../endpoints/multiAccess/useGetContractCount';
import { useGetMultiAccessList } from '../../../../endpoints/multiAccess/useGetMultiAccessList';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import { MainLinkStyle, TextRegular } from '../../../../style/utils';

interface Props {
  callback?: string;
}

const MultiAccessClientList: FC<Props> = ({ callback }) => {
  const [valueSearch, setValueSearch] = React.useState('');
  const [t] = useTranslation();
  const themeContext = React.useContext(ThemeContext);
  const history = useHistory();
  const { data: usersList, isLoading, isError } = useGetMultiAccessList();
  const { data: contractsCount, isFetching: isContractCountFetching } = useGetContractCount();

  const header = React.useMemo(() => {
    if (!usersList) {
      return [];
    }

    return [
      {
        title: t('multi-access-client-list-company'),
        key: t('multi-access-client-list-company'),
        dataIndex: 'company',
        render: (company) => <MainLinkStyle>{company}</MainLinkStyle>,
      },
      {
        title: t('multi-access-client-list-name'),
        key: t('multi-access-client-list-name'),
        render: (record) => (
          <div>
            {record.firstName} {record.lastName}
          </div>
        ),
      },
      {
        title: t('multi-access-client-list-access'),
        key: t('multi-access-client-list-access'),
        dataIndex: 'clientCanLogin',
        align: 'center',
        render: (clientCanLogin) => t(`multi-access-list-client-can-login-${clientCanLogin ? 'true' : 'false'}`),
      },
      {
        title: t('multi-access-client-list-current-contract'),
        key: t('multi-access-client-list-current-contract'),
        dataIndex: 'contractCount',
        align: 'center',
      },
      {
        align: 'right',
        render: () => <ArrowRight color={themeContext.colors.baseColor} />,
      },
    ];
  }, [t, themeContext.colors.baseColor, usersList]);

  const dataSource = React.useMemo(() => {
    if (!usersList || isContractCountFetching) return [];

    return usersList.list
      .map((item) => {
        const findContractCount = contractsCount.find((contract) => contract.userId === item.id);

        return {
          ...item,
          key: item.id,
          name: `${item.firstName} ${item.lastName}`,
          contractCount: findContractCount?.contracts || 0,
          clientCanLogin: item.multiaccess.clientCanLogin,
        };
      })
      .filter((item) => {
        if (!valueSearch) return true;

        return [item.company, item.name].some((value) => value.match(new RegExp(valueSearch, 'gmi')));
      });
  }, [contractsCount, isContractCountFetching, usersList, valueSearch]);

  const handleClickSearch = React.useCallback(
    (e) => {
      setValueSearch(e.target.value);
    },
    [setValueSearch],
  );

  if (isError) {
    return null;
  }

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox
        backButtonText={t('global-back')}
        extra={
          <GradientButton
            disabled={!usersList?.canCreateClientAccount ?? true}
            onClick={() => history.push(Navigation.MULTI_ACCESS_CREATE)}
          >
            {t('multi-access-list-add-client')}
          </GradientButton>
        }
        icon={<CompanyIcon />}
        title={t('multi-access-list-title')}
        to={callback}
      >
        <Space direction="vertical" size={25}>
          <Row>
            <Col>
              <TextRegular>
                <SafeHTMLTranslate template="multi-access-list-description-info" />
              </TextRegular>
            </Col>
          </Row>

          <Hr noBottom noTop />

          <Row justify="end">
            <Col sm={7} xs={24}>
              <Search onChange={handleClickSearch} />
            </Col>
          </Row>

          <div>
            <Hr noBottom noTop />
            <Table
              /* @ts-ignore */
              columns={header}
              dataSource={dataSource}
              loading={isLoading || isContractCountFetching}
              onRow={(record) => ({
                  onClick: () => {
                    history.push(Navigation.MULTI_ACCESS_DETAILS.replace(':userId', record.id));
                  },
                })}
            />
          </div>
        </Space>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default MultiAccessClientList;

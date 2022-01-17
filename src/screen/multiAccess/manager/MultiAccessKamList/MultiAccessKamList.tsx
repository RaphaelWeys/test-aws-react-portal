import { Col, Row, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import { ThemeContext } from 'styled-components';

import GradientButton from '../../../../components/GradientButton';
import Hr from '../../../../components/Hr';
import ArrowRight from '../../../../components/icons/ArrowRight';
import FilterIcon from '../../../../components/icons/FilterIcon';
import KamIcon from '../../../../components/icons/KamIcon';
import Search from '../../../../components/Input/Search';
import Select from '../../../../components/Select';
import Table from '../../../../components/Table';
import { useGetGroupList } from '../../../../endpoints/groups/useGetGroupList';
import { useGetContractCount } from '../../../../endpoints/multiAccess/useGetContractCount';
import { useGetMultiAccessList } from '../../../../endpoints/multiAccess/useGetMultiAccessList';
import useCookie from '../../../../hooks/useCookie';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import { MainLinkStyle, WarningText } from '../../../../style/utils';

interface Props {
  callback?: string;
}

const widthTD = ['25%', '70%', '1%'];

const MultiAccessKamList = ({ callback }: Props) => {
  const [t] = useTranslation();
  const [valueSearch, setValueSearch] = React.useState('');
  const [groupSelected, setGroupSelected] = React.useState(null);
  const themeContext = React.useContext(ThemeContext);
  const history = useHistory();
  const { data: usersList, isFetching, refetch: refetchUserList } = useGetMultiAccessList(groupSelected, false);
  const { data: contractsCount, isLoading: isContractCountLoading } = useGetContractCount();
  const { data: groupList, isLoading: isGroupListLoading } = useGetGroupList();
  const { getCookie, setCookie } = useCookie();

  React.useEffect(() => {
    const groupId = getCookie('groupId') || '0';

    setGroupSelected(groupId);
  }, [getCookie, refetchUserList]);

  React.useEffect(() => {
    if (groupSelected) {
      refetchUserList();
    }
  }, [groupSelected, refetchUserList]);

  const canCreateKamAccount = React.useMemo(() => {
    if (!usersList) return;

    return usersList.canCreateKamAccount;
  }, [usersList]);

  const handleClickSearch = React.useCallback(
    (e) => {
      setValueSearch(e.target.value);
    },
    [setValueSearch],
  );

  const dataSource = React.useMemo(() => {
    if (!usersList || isContractCountLoading) return [];

    return usersList.list.map((item) => {
      const findContractCount = contractsCount.find((contract) => contract.userId === item.id);

      return {
        ...item,
        key: item.id,
        contractCount: findContractCount?.contracts || 0,
      };
    });
  }, [contractsCount, isContractCountLoading, usersList]);

  const filteredDataSource = React.useMemo(() => {
    if (!valueSearch) return dataSource;

    return dataSource.filter(({ firstName, lastName }) =>
      [firstName, lastName].some((value) => value.match(new RegExp(valueSearch, 'gmi'))),
    );
  }, [dataSource, valueSearch]);

  const header = React.useMemo(() => {
    if (!usersList) {
      return [];
    }
    return ['company', 'contractCount', 'action'].map((key, index) => ({
      title: key,
      key,
      width: widthTD[index],
      render: (record) => {
        if (key === 'action') return <ArrowRight color={themeContext.colors.baseColor} />;
        if (key === 'contractCount')
          return (
            <div>
              {t('multi-access-list-contract-count')}: {record.contractCount}
            </div>
          );

        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <MainLinkStyle>
              {record.lastName} {record.firstName}
            </MainLinkStyle>
          </div>
        );
      },
    }));
  }, [t, themeContext.colors.baseColor, usersList]);

  const selectGroupItems = React.useMemo(() => {
    if (!groupList) {
      return [];
    }

    return groupList.reduce(
      (acc, item) => {
        acc.push({ key: item.id, label: item.name, value: item.id });
        return acc;
      },
      [{ key: '0', label: t('multi-access-list-kam-all-group'), value: '0' }],
    );
  }, [groupList, t]);

  const handleChangeGroup = React.useCallback(
    (value) => {
      setCookie('groupId', value);
      setGroupSelected(value);
    },
    [setCookie],
  );

  const isDisableAddKamBtn = React.useMemo(() => {
    if (!usersList) return true;

    return usersList.canCreateKamAccount === false;
  }, [usersList]);

  const extra = React.useMemo(() => (
      <Space>
        <GradientButton disabled={isDisableAddKamBtn} onClick={() => history.push(Navigation.MULTI_ACCESS_CREATE)}>
          {t('multi-access-list-add-kam')}
        </GradientButton>
        <GradientButton variant="outlined" onClick={() => history.push(Navigation.GROUP_LIST)}>
          {t('multi-access-list-handle-group')}
        </GradientButton>
      </Space>
    ), [history, isDisableAddKamBtn, t]);

  if (selectGroupItems.length === 0) {
    return null;
  }

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox
        backButtonText={t('global-back')}
        extra={extra}
        icon={<KamIcon />}
        title={t('multi-access-list-title-kam')}
        to={callback}
      >
        <div>
          <Hr noTop />

          <Row align="middle" gutter={[25, 16]}>
            <Col sm={1} xs={3}>
              <FilterIcon />
            </Col>
            <Col sm={9} xs={21}>
              <Select
                items={selectGroupItems}
                loading={isGroupListLoading}
                value={groupSelected}
                onChange={handleChangeGroup}
              />
            </Col>
            <Col sm={9} xs={24}>
              <Search allowClear onChange={handleClickSearch} />
            </Col>
          </Row>

          <Hr noBottom={canCreateKamAccount === true} />

          <Space direction="vertical" size="middle">
            {canCreateKamAccount === false && <WarningText>{t('multi-access-list-warning-kam')}</WarningText>}

            <Table
              columns={header}
              dataSource={filteredDataSource}
              loading={isFetching}
              showHeader={false}
              onRow={(record) => ({
                  onClick: () => {
                    history.push(Navigation.MULTI_ACCESS_DETAILS.replace(':userId', record.id));
                  },
                })}
            />
          </Space>
        </div>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default MultiAccessKamList;

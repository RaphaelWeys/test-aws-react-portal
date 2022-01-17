import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';

import GradientButton from '../../../../components/GradientButton';
import ArrowRight from '../../../../components/icons/ArrowRight';
import KamMultiple from '../../../../components/icons/KamMultipleIcon';
import Table from '../../../../components/Table';
import { useGetGroupList } from '../../../../endpoints/groups/useGetGroupList';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import history from '../../../../router/history';
import { MainLinkStyle, TextRegular } from '../../../../style/utils';

const GroupList = () => {
  const [t] = useTranslation();
  const { data: groupList, isLoading: isGroupListLoading } = useGetGroupList();
  const themeContext = React.useContext(ThemeContext);

  const dataSource = React.useMemo(() => {
    if (!groupList) return [];

    return groupList
      .map((item) => ({
          ...item,
          key: item.id,
        }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [groupList]);

  const header = React.useMemo(() => {
    if (!groupList) {
      return [];
    }

    return [
      {
        dataIndex: 'name',
        title: 'name',
        key: 'name',
        width: '99%',
        render: (name) => <MainLinkStyle>{name}</MainLinkStyle>,
      },
      {
        title: 'action',
        key: 'action',
        width: '1%',
        render: () => <ArrowRight color={themeContext.colors.baseColor} />,
      },
    ];
  }, [groupList, themeContext.colors.baseColor]);

  const extra = React.useMemo(() => (
      <GradientButton onClick={() => history.push(Navigation.GROUP_CREATE)}>
        {t('multi-access-group-add-btn')}
      </GradientButton>
    ), [t]);

  if (isGroupListLoading) {
    return null;
  }

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox
        backButtonText={t('multi-access-group-back-btn')}
        extra={extra}
        icon={<KamMultiple />}
        title={t('multi-access-group-title')}
        to={Navigation.MULTI_ACCESS}
      >
        {groupList.length === 0 ? (
          <TextRegular>{t('multi-access-group-no-group')}</TextRegular>
        ) : (
          <Table
            columns={header}
            dataSource={dataSource}
            showHeader={false}
            onRow={(record) => ({
                onClick: () => {
                  history.push(Navigation.GROUP_DETAILS.replace(':id', record.id));
                },
              })}
          />
        )}
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default GroupList;

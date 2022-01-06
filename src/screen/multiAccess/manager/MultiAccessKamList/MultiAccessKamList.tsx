import { Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import { useHistory } from 'react-router';

import { useGetMultiAccessList } from '../../../../endpoints/multiAccess/useGetMultiAccessList';
import { BlueStyle, WarningText } from '../../../../style/utils';
import GradientButton from '../../../../components/GradientButton';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import Table from '../../../../components/Table';
import { Navigation } from '../../../../navigation';
import ArrowRight from '../../../../components/icons/ArrowRight';
import MainLayout from '../../../../layout/MainLayout';
import { useGetContractCount } from '../../../../endpoints/multiAccess/useGetContractCount';
import KamMultiple from '../../../../components/icons/KamMultipleIcon';

interface Props {
  callback?: string;
}

const widthTD = ['25%', '70%', '1%'];

const MultiAccessKamList = ({ callback }: Props) => {
  const [t] = useTranslation();
  const themeContext = React.useContext(ThemeContext);
  const history = useHistory();
  const { data: usersList, isLoading, isError } = useGetMultiAccessList();
  const { data: contractsCount, isLoading: isContractCountLoading } = useGetContractCount();

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
            <BlueStyle>
              {record.firstName} {record.lastName}
            </BlueStyle>
          </div>
        );
      },
    }));
  }, [t, themeContext.colors.baseColor, usersList]);

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

  const isDisableAddKamBtn = React.useMemo(() => {
    if (!usersList) return true;

    return usersList.canCreateKamAccount === false;
  }, [usersList]);

  if (isError) {
    return null;
  }

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox
        backButtonText={t('global-back')}
        to={callback}
        icon={<KamMultiple />}
        title={t('multi-access-list-title-kam')}
        extra={
          <GradientButton disabled={isDisableAddKamBtn} onClick={() => history.push(Navigation.MULTI_ACCESS_CREATE)}>
            {t('multi-access-list-add-kam')}
          </GradientButton>
        }
      >
        <Space direction="vertical" size={25}>
          {usersList?.canCreateKamAccount === false && <WarningText>{t('multi-access-list-warning-kam')}</WarningText>}

          <div>
            <Table
              columns={header}
              dataSource={dataSource}
              showHeader={false}
              loading={isLoading}
              onRow={(record) => {
                return {
                  onClick: () => {
                    history.push(Navigation.MULTI_ACCESS_DETAILS.replace(':userId', record.id));
                  },
                };
              }}
            />
          </div>
        </Space>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default MultiAccessKamList;

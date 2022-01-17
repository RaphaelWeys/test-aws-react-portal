import { Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import ButtonLink from '../../../../components/ButtonLink';
import GradientButton from '../../../../components/GradientButton';
import Hr from '../../../../components/Hr';
import KamIcon from '../../../../components/icons/KamIcon';
import ModalDeleteMultiAccess from '../../../../components/Modal/ModalDeleteMultiAccess';
import ModalTransfersAllAccount from '../../../../components/Modal/ModalTransfersAllAccount';
import { useGetCanDeleteUser } from '../../../../endpoints/multiAccess/useGetCanDeleteUser';
import { useGetMultiAccessKamInfo } from '../../../../endpoints/multiAccess/useGetMultiAccessKamInfo';
import { useGetMultiAccessUserDetail } from '../../../../endpoints/multiAccess/useGetMultiAccssUserDetail';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import history from '../../../../router/history';
import { Label, TextRegular } from '../../../../style/utils';

const MultiAccessKamDetails: FC = () => {
  const [t] = useTranslation();
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [showModalTransfersAllClientAccount, setShowModalTransfersAllClientAccount] = React.useState(false);
  const { userId } = useParams<{ userId: string }>();
  const { data: userDetails, isLoading: userDetailsLoading, isError: userDetailsError } = useGetMultiAccessUserDetail(
    userId,
  );
  const { data: canDeleteUser } = useGetCanDeleteUser(userId);
  const { data: kamInfo, isLoading: kamInfoLoading, isError: kamInfoError } = useGetMultiAccessKamInfo(userId);

  const columnLength = React.useMemo(() => {
    if (!userDetails) {
      return;
    }
    return userDetails.kamGroups.length === 0 ? 8 : 6;
  }, [userDetails]);

  const canDeleteKam = React.useMemo(() => {
    if (!kamInfo) {
      return null;
    }

    return !(kamInfo.totalContracts > 0 || kamInfo.totalClients > 0);
  }, [kamInfo]);

  if (userDetailsLoading || userDetailsError || kamInfoLoading || kamInfoError) {
    return null;
  }

  return (
    <>
      <MainLayout hasBg={false}>
        <WrapperWhiteBox
          backButtonText="multi-access-all-account-kam"
          extra={
            <GradientButton onClick={() => history.push(Navigation.MULTI_ACCESS_EDIT.replace(':userId', userId))}>
              {t('multi-access-list-modify-client')}
            </GradientButton>
          }
          icon={<KamIcon />}
          title={`${userDetails.user.firstName} ${userDetails.user.lastName}`}
          to={Navigation.MULTI_ACCESS}
        >
          <Space direction="vertical" size={0}>
            <div>
              <Hr noTop />

              <Space direction="vertical">
                <Row gutter={[25, 20]}>
                  {userDetails.kamGroups.length !== 0 && (
                    <Col sm={columnLength} xs={24}>
                      <Space direction="vertical">
                        <Label>{t('multi-access-user-group-title')}</Label>
                        <Space direction="vertical" size={0}>
                          {userDetails.kamGroups.map((group) => (
                            <TextRegular key={group.id}>{group.name}</TextRegular>
                          ))}
                        </Space>
                      </Space>
                    </Col>
                  )}
                  <Col sm={columnLength} xs={24}>
                    <Space direction="vertical">
                      <Label>{t('multi-access-user-contact-title')}</Label>
                      <Space direction="vertical">
                        <TextRegular>{userDetails.user.phone}</TextRegular>
                        <a href={`mailto:${userDetails.user.username}`} style={{ whiteSpace: 'nowrap' }}>
                          <ButtonLink onClick={null}>{userDetails.user.username}</ButtonLink>
                        </a>
                      </Space>
                    </Space>
                  </Col>
                  <Col sm={columnLength} xs={24}>
                    <Space direction="vertical">
                      <Label>{t('multi-access-user-contract-title')}</Label>
                      <TextRegular>
                        {t('multi-access-user-contract-progress')} {kamInfo.optimizedContracts}
                      </TextRegular>
                    </Space>
                  </Col>
                  <Col sm={columnLength} xs={24}>
                    <Space direction="vertical">
                      <Label>{t('multi-access-monitoring-client-access')}</Label>
                      <div>
                        <TextRegular>
                          {t('multi-access-user-client-account')} {kamInfo.totalClients}
                        </TextRegular>
                      </div>
                    </Space>
                  </Col>
                </Row>
              </Space>

              <Hr />
            </div>

            <Space size="large">
              <ButtonLink onClick={() => setShowModalTransfersAllClientAccount(true)}>
                {t('multi-access-transfers-all-account')}
              </ButtonLink>
              {canDeleteUser?.canDelete && (
                <ButtonLink onClick={() => setShowModalDelete(true)}>{t('multi-access-delete-account')}</ButtonLink>
              )}
            </Space>
          </Space>
        </WrapperWhiteBox>
      </MainLayout>

      {showModalDelete && (
        <ModalDeleteMultiAccess
          canDelete={canDeleteKam}
          companyName={userDetails.user.company}
          firstName={userDetails.user.firstName}
          lastName={userDetails.user.lastName}
          userId={userDetails.user._id}
          onClose={() => setShowModalDelete(false)}
        />
      )}

      {showModalTransfersAllClientAccount && (
        <ModalTransfersAllAccount
          firstName={userDetails.user.firstName}
          lastName={userDetails.user.lastName}
          userId={userDetails.user._id}
          onClose={() => setShowModalTransfersAllClientAccount(false)}
        />
      )}
    </>
  );
};

export default MultiAccessKamDetails;

import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import ButtonLink from '../../../../components/ButtonLink';
import { useGetMultiAccessUserDetail } from '../../../../endpoints/multiAccess/useGetMultiAccssUserDetail';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import GradientButton from '../../../../components/GradientButton';
import { Label, TextRegular } from '../../../../style/utils';
import { Navigation } from '../../../../navigation';
import ModalDeleteMultiAccess from '../../../../components/Modal/ModalDeleteMultiAccess';
import Hr from '../../../../components/Hr';
import { useGetMultiAccessKamInfo } from '../../../../endpoints/multiAccess/useGetMultiAccessKamInfo';
import KamIcon from '../../../../components/icons/KamIcon';
import ModalTransfersAllAccount from '../../../../components/Modal/ModalTransfersAllAccount';
import { useGetCanDeleteUser } from '../../../../endpoints/multiAccess/useGetCanDeleteUser';
import history from '../../../../router/history';

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
          to={Navigation.MULTI_ACCESS}
          icon={<KamIcon />}
          title={`${userDetails.user.firstName} ${userDetails.user.lastName}`}
          extra={
            <GradientButton onClick={() => history.push(Navigation.MULTI_ACCESS_EDIT.replace(':userId', userId))}>
              {t('multi-access-list-modify-client')}
            </GradientButton>
          }
        >
          <Space direction="vertical" size={0}>
            <div>
              <Hr noTop />

              <Space direction="vertical">
                <Row gutter={[25, 20]}>
                  <Col xs={24} sm={7}>
                    <Space direction="vertical" size="middle">
                      <Label>{t('multi-access-user-contact-title')}</Label>
                      <Space direction="vertical">
                        <TextRegular>{userDetails.user.phone}</TextRegular>
                        <a href={`mailto:${userDetails.user.username}`}>
                          <ButtonLink onClick={null}>{userDetails.user.username}</ButtonLink>
                        </a>
                      </Space>
                    </Space>
                  </Col>
                  <Col xs={24} sm={7}>
                    <Space direction="vertical" size="middle">
                      <Label>{t('multi-access-user-contract-title')}</Label>
                      <TextRegular>
                        {t('multi-access-user-contract-progress')} {kamInfo.optimizedContracts}
                      </TextRegular>
                    </Space>
                  </Col>
                  <Col xs={24} sm={7}>
                    <Space direction="vertical" size="middle">
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
          userId={userDetails.user._id}
          onClose={() => setShowModalDelete(false)}
          canDelete={canDeleteKam}
          companyName={userDetails.user.company}
          firstName={userDetails.user.firstName}
          lastName={userDetails.user.lastName}
        />
      )}

      {showModalTransfersAllClientAccount && (
        <ModalTransfersAllAccount
          userId={userDetails.user._id}
          onClose={() => setShowModalTransfersAllClientAccount(false)}
          firstName={userDetails.user.firstName}
          lastName={userDetails.user.lastName}
        />
      )}
    </>
  );
};

export default MultiAccessKamDetails;

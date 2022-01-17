import { Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import InfoStatusRfo from '../../../components/InfoStatusRfo/InfoStatusRfo';
import { SIGNATURE_DOC_SUPPLIER_STATUS } from '../../../config/app-config';
import { SignaturePackSupplier } from '../../../interface/signature';
import RectangleBox from '../../../layout/RectangleBox/RectangleBox';
import DocumentUploaded from '../DocumentUploaded/DocumentUploaded';
import HistoricBlock from '../HistoricBlock/HistoricBlock';
import NoDocument from '../NoDocument';

interface Props {
  className?: string;
  signaturePack: SignaturePackSupplier;
  packId: string;
  getSignaturePack: () => Promise<any>;
}

const Supplier: FC<Props> = ({ className, signaturePack, packId, getSignaturePack }) => {
  const [t] = useTranslation();

  return (
    <RectangleBox className={className} showLogo={false} title={signaturePack.documentReference}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {[
          SIGNATURE_DOC_SUPPLIER_STATUS.NO_DOCUMENT,
          SIGNATURE_DOC_SUPPLIER_STATUS.WAITING_FOR_SIGNATURE,
          SIGNATURE_DOC_SUPPLIER_STATUS.SIGNED,
        ].includes(signaturePack.currentVersion.docSupplierStatus) && (
          <Row>
            <Col span={24}>
              <InfoStatusRfo
                description={`signature-rfo-${signaturePack.currentVersion.docSupplierStatus}-description`}
                title={t(`signature-rfo-${signaturePack.currentVersion.docSupplierStatus}-title`)}
              />
            </Col>
          </Row>
        )}
        <Row>
          <Col>{t('signature-rfo-description')}</Col>
        </Row>
        <Space direction="vertical">
          <Row>
            <Col>
              <h2>{t('signature-rfo-description-organizer')}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>{signaturePack.documentSignerContact.company}</div>
              <div>
                {signaturePack.documentSignerContact.firstName} {signaturePack.documentSignerContact.lastName}
              </div>
              <div>{signaturePack.documentSignerContact.mail}</div>
              <div>{signaturePack.documentSignerContact.phone}</div>
            </Col>
          </Row>
        </Space>

        {signaturePack.currentVersion.docSupplierStatus === SIGNATURE_DOC_SUPPLIER_STATUS.NO_DOCUMENT && (
          <NoDocument getSignaturePack={getSignaturePack} packId={packId as string} />
        )}

        {[SIGNATURE_DOC_SUPPLIER_STATUS.WAITING_FOR_SIGNATURE, SIGNATURE_DOC_SUPPLIER_STATUS.SIGNED].includes(
          signaturePack.currentVersion.docSupplierStatus,
        ) && (
          <DocumentUploaded
            isSupplier
            currentVersion={signaturePack.currentVersion}
            getSignaturePack={getSignaturePack}
            packId={packId as string}
            status={signaturePack.currentVersion.docSupplierStatus}
          />
        )}

        {signaturePack.archivedVersions.length > 0 && (
          <HistoricBlock isSupplier archivedVersions={signaturePack.archivedVersions} packId={packId as string} />
        )}
      </Space>
    </RectangleBox>
  );
};

export default styled(Supplier)``;

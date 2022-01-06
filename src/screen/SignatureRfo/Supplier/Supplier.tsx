import React, { FC } from 'react';
import styled from 'styled-components';
import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { SIGNATURE_DOC_SUPPLIER_STATUS } from '../../../config/app-config';
import InfoStatusRfo from '../../../components/InfoStatusRfo/InfoStatusRfo';
import NoDocument from '../NoDocument';
import DocumentUploaded from '../DocumentUploaded/DocumentUploaded';
import HistoricBlock from '../HistoricBlock/HistoricBlock';
import RectangleBox from '../../../layout/RectangleBox/RectangleBox';
import { SignaturePackSupplier } from '../../../interface/signature';

interface Props {
  className?: string;
  signaturePack: SignaturePackSupplier;
  packId: string;
  getSignaturePack: () => Promise<any>;
}

const Supplier: FC<Props> = ({ className, signaturePack, packId, getSignaturePack }) => {
  const [t] = useTranslation();

  return (
    <RectangleBox showLogo={false} title={signaturePack.documentReference} className={className}>
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
        {[
          SIGNATURE_DOC_SUPPLIER_STATUS.NO_DOCUMENT,
          SIGNATURE_DOC_SUPPLIER_STATUS.WAITING_FOR_SIGNATURE,
          SIGNATURE_DOC_SUPPLIER_STATUS.SIGNED,
        ].includes(signaturePack.currentVersion.docSupplierStatus) && (
          <Row>
            <Col span={24}>
              <InfoStatusRfo
                title={t(`signature-rfo-${signaturePack.currentVersion.docSupplierStatus}-title`)}
                description={`signature-rfo-${signaturePack.currentVersion.docSupplierStatus}-description`}
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
          <NoDocument packId={packId as string} getSignaturePack={getSignaturePack} />
        )}

        {[SIGNATURE_DOC_SUPPLIER_STATUS.WAITING_FOR_SIGNATURE, SIGNATURE_DOC_SUPPLIER_STATUS.SIGNED].includes(
          signaturePack.currentVersion.docSupplierStatus,
        ) && (
          <DocumentUploaded
            getSignaturePack={getSignaturePack}
            currentVersion={signaturePack.currentVersion}
            packId={packId as string}
            isSupplier
            status={signaturePack.currentVersion.docSupplierStatus}
          />
        )}

        {signaturePack.archivedVersions.length > 0 && (
          <HistoricBlock archivedVersions={signaturePack.archivedVersions} packId={packId as string} isSupplier />
        )}
      </Space>
    </RectangleBox>
  );
};

export default styled(Supplier)``;

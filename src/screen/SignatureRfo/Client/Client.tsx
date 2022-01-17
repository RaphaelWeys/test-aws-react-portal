import { Col, Row, Space } from 'antd';
import React, { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import CommonButton from '../../../components/CommonButton';
import InfoStatusRfo from '../../../components/InfoStatusRfo/InfoStatusRfo';
import { SIGNATURE_DOC_SIGNER_STATUS } from '../../../config/app-config';
import { SignaturePackClient } from '../../../interface/signature';
import RectangleBox from '../../../layout/RectangleBox/RectangleBox';
import AddNewSigner from '../AddNewSigner';
import DocumentUploaded from '../DocumentUploaded/DocumentUploaded';
import HistoricBlock from '../HistoricBlock/HistoricBlock';
import StatusValidatorsSigners from '../StatusValidatorsSigners';
import ValidatorsSigners from '../StatusValidatorsSigners/ValidatorsSigners';

interface Props {
  className?: string;
  signaturePack: SignaturePackClient;
  packId: string;
  getSignaturePack: () => Promise<any>;
}

const Client: FC<Props> = ({ className, signaturePack, packId, getSignaturePack }) => {
  const [t] = useTranslation();
  const title = `${t('client-signature-title')} - ${signaturePack.documentSupplierName}`;
  const [showAddValidators, setShowAddValidators] = useState(false);

  const extra = useMemo(
    () => (
      <ValidatorsSigners
        canSendEmail={false}
        signers={signaturePack.currentVersion.signers}
        validators={signaturePack.currentVersion.validators}
      />
    ),
    [signaturePack],
  );

  return (
    <RectangleBox className={className} showLogo={false} title={title}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div>
          <div>
            {t('client-signature-name-rfo')}: {signaturePack.documentName}
          </div>
          <div>
            {t('client-signature-reference')}: {signaturePack.documentReference}
          </div>
        </div>

        <Space direction="vertical">
          <Row>
            <Col>
              <h2>{t('client-signature-organizer')}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>{signaturePack.documentSupplierContact.company}</div>
              <div>
                {signaturePack.documentSupplierContact.firstName} {signaturePack.documentSupplierContact.lastName}
              </div>
              <div>{signaturePack.documentSupplierContact.mail}</div>
              <div>{signaturePack.documentSupplierContact.phone}</div>
            </Col>
          </Row>
        </Space>

        <Row>
          <Col span={24}>
            <InfoStatusRfo
              description={t(`signature-rfo-${signaturePack.currentVersion.docSignerStatus}-description`)}
              title={t(`signature-rfo-${signaturePack.currentVersion.docSignerStatus}-title`)}
            />
          </Col>
        </Row>

        {!showAddValidators &&
          ![SIGNATURE_DOC_SIGNER_STATUS.NO_OFFER, SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_SIGNED].includes(
            signaturePack.currentVersion.docSignerStatus,
          ) && (
            <>
              <DocumentUploaded
                currentVersion={signaturePack.currentVersion}
                getSignaturePack={getSignaturePack}
                isSupplier={false}
                packId={packId as string}
                status={signaturePack.currentVersion.docSignerStatus}
              />

              {SIGNATURE_DOC_SIGNER_STATUS.NO_PROCEDURE === signaturePack.currentVersion.docSignerStatus && (
                <CommonButton type="primary" onClick={() => setShowAddValidators(true)}>
                  {t('signature-rfo-chose-validator')}
                </CommonButton>
              )}
            </>
          )}

        {showAddValidators && (
          <AddNewSigner
            getSignaturePack={getSignaturePack}
            packId={packId}
            setShowAddValidators={setShowAddValidators}
            onSubmitSuccess={() => setShowAddValidators(false)}
          />
        )}

        {[SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_STARTED].includes(signaturePack.currentVersion.docSignerStatus) && (
          <StatusValidatorsSigners
            canSendEmail
            packId={packId}
            signers={signaturePack.currentVersion.signers}
            validators={signaturePack.currentVersion.validators}
          />
        )}

        {[SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_SIGNED].includes(signaturePack.currentVersion.docSignerStatus) && (
          <DocumentUploaded
            currentVersion={signaturePack.currentVersion}
            extra={extra}
            getSignaturePack={getSignaturePack}
            isSupplier={false}
            packId={packId as string}
            status={signaturePack.currentVersion.docSignerStatus}
          />
        )}

        {signaturePack.archivedVersions.length > 0 && (
          <HistoricBlock
            archivedVersions={signaturePack.archivedVersions}
            isSupplier={false}
            packId={packId as string}
          />
        )}
      </Space>
    </RectangleBox>
  );
};

export default styled(Client)``;

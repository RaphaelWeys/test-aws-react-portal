import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Col, Row, Space } from 'antd';

import { SignaturePackClient } from '../../../interface/signature';
import { SIGNATURE_DOC_SIGNER_STATUS } from '../../../config/app-config';
import InfoStatusRfo from '../../../components/InfoStatusRfo/InfoStatusRfo';
import DocumentUploaded from '../DocumentUploaded/DocumentUploaded';
import RectangleBox from '../../../layout/RectangleBox/RectangleBox';
import CommonButton from '../../../components/CommonButton';
import AddNewSigner from '../AddNewSigner';
import StatusValidatorsSigners from '../StatusValidatorsSigners';
import ValidatorsSigners from '../StatusValidatorsSigners/ValidatorsSigners';
import HistoricBlock from '../HistoricBlock/HistoricBlock';

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
        signers={signaturePack.currentVersion.signers}
        validators={signaturePack.currentVersion.validators}
        canSendEmail={false}
      />
    ),
    [signaturePack],
  );

  return (
    <RectangleBox showLogo={false} title={title} className={className}>
      <Space size="middle" direction="vertical" style={{ width: '100%' }}>
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
              title={t(`signature-rfo-${signaturePack.currentVersion.docSignerStatus}-title`)}
              description={t(`signature-rfo-${signaturePack.currentVersion.docSignerStatus}-description`)}
            />
          </Col>
        </Row>

        {!showAddValidators &&
          ![SIGNATURE_DOC_SIGNER_STATUS.NO_OFFER, SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_SIGNED].includes(
            signaturePack.currentVersion.docSignerStatus,
          ) && (
            <>
              <DocumentUploaded
                getSignaturePack={getSignaturePack}
                currentVersion={signaturePack.currentVersion}
                packId={packId as string}
                isSupplier={false}
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
            setShowAddValidators={setShowAddValidators}
            packId={packId}
            getSignaturePack={getSignaturePack}
            onSubmitSuccess={() => setShowAddValidators(false)}
          />
        )}

        {[SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_STARTED].includes(signaturePack.currentVersion.docSignerStatus) && (
          <StatusValidatorsSigners
            validators={signaturePack.currentVersion.validators}
            signers={signaturePack.currentVersion.signers}
            packId={packId}
            canSendEmail
          />
        )}

        {[SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_SIGNED].includes(signaturePack.currentVersion.docSignerStatus) && (
          <DocumentUploaded
            getSignaturePack={getSignaturePack}
            currentVersion={signaturePack.currentVersion}
            packId={packId as string}
            isSupplier={false}
            status={signaturePack.currentVersion.docSignerStatus}
            extra={extra}
          />
        )}

        {signaturePack.archivedVersions.length > 0 && (
          <HistoricBlock
            archivedVersions={signaturePack.archivedVersions}
            packId={packId as string}
            isSupplier={false}
          />
        )}
      </Space>
    </RectangleBox>
  );
};

export default styled(Client)``;

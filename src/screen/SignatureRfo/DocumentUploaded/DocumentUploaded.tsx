import React, { FC, useCallback, useState } from 'react';
import { Col, Row, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons/lib';
import styled, { css, ThemeContext } from 'styled-components';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import CommonButton from '../../../components/CommonButton';
import { SupplierNoteLabel } from '../SignatureRfo.styled';
import { GrayBox } from './DocumentUploaded.styled';
import ModalAbandonOffer from '../../../components/Modal/ModalAbandonOffer';
import { SIGNATURE_DOC_SIGNER_STATUS, SIGNATURE_DOC_SUPPLIER_STATUS } from '../../../config/app-config';
import InvisibleButton from '../../../components/InvisibleButton/InvisibleButton';

interface Props {
  getSignaturePack: () => Promise<any>;
  status: string;
  currentVersion: any;
  packId: string;
  className?: string;
  isSupplier: boolean;
  extra?: React.ReactNode;
}

const DocumentUploaded: FC<Props> = ({
  getSignaturePack,
  isSupplier,
  status,
  currentVersion,
  className,
  packId,
  extra,
}) => {
  const [t] = useTranslation();
  const themeContext = React.useContext(ThemeContext);
  const user = isSupplier ? 'supplier' : 'client';
  const [showModalAbandonOffer, setShowModalAbandonOffer] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const downloadFileUrl = useCallback(
    (fileId) => {
      if (currentVersion.docSignerStatus === SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_SIGNED)
        return `${process.env.REACT_APP_BACKEND_PORTAL_URL}/signature/download/signed/${packId}/${fileId}`;
      if (isSupplier)
        return `${process.env.REACT_APP_BACKEND_PORTAL_URL}/signature/docSupplier/download/${packId}/${fileId}`;
      return `${process.env.REACT_APP_BACKEND_PORTAL_URL}/signature/docSigner/download/${packId}/${fileId}`;
    },
    [packId, currentVersion.docSignerStatus],
  );

  const hideModalAandonOffer = useCallback(() => {
    setShowModalAbandonOffer(false);
  }, []);

  return (
    <>
      <Space direction="vertical" size="middle" className={className}>
        <Space direction="vertical">
          <Row>
            <Col>
              <h2>{t(`signature-rfo-documents-${user}-signature`)}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>{t(`signature-rfo-documents-${user}-signature-description`)}</div>
            </Col>
          </Row>
        </Space>

        <GrayBox>
          <Space direction="vertical" size="middle">
            <Row justify="space-between">
              <Col>
                <h3>{t(`signature-rfo-documents-${user}-${status}`)}</h3>
              </Col>
              <Col>
                {[
                  SIGNATURE_DOC_SIGNER_STATUS.NO_PROCEDURE,
                  SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_STARTED,
                  SIGNATURE_DOC_SUPPLIER_STATUS.WAITING_FOR_SIGNATURE,
                ].includes(status) && (
                  <CommonButton onClick={() => setShowModalAbandonOffer(true)}>
                    <span>{t(`signature-rfo-documents-give-up-offer-btn-${user}`)}</span>
                  </CommonButton>
                )}
                {[SIGNATURE_DOC_SUPPLIER_STATUS.SIGNED, SIGNATURE_DOC_SIGNER_STATUS.PROCEDURE_SIGNED].includes(
                  status,
                ) && (
                  <div>
                    {t(`signature-rfo-documents-signature-date-${user}`)}:{' '}
                    {moment(currentVersion.statusUpdateDate).format('DD/M/YYYY HH:mm')}
                  </div>
                )}
              </Col>
            </Row>
            <div>
              {currentVersion.docSupplierDocuments.map((file: any) => (
                <Row justify="space-between" style={{ borderBottom: '1px solid #A6ADB4', padding: '10px 0' }}>
                  <Col>
                    <div>{file.originalname}</div>
                  </Col>
                  <Col style={{ color: themeContext.colors.baseColor }}>
                    <a href={downloadFileUrl(file.filename)}>
                      <Space>
                        <span>{t(`signature-rfo-see-offer-${status}-${user}`)}</span>
                        <EyeOutlined />
                      </Space>
                    </a>
                  </Col>
                </Row>
              ))}
            </div>
            {currentVersion.docSupplierMessage && (
              <Space direction="vertical">
                <SupplierNoteLabel>{t(`signature-rfo-note-supplier`)}</SupplierNoteLabel>
                <div>{currentVersion.docSupplierMessage}</div>
              </Space>
            )}

            {showMore && extra}

            {!!extra && (
              <InvisibleButton onClick={() => setShowMore((v) => !v)}>
                <span>{t(`signature-rfo-historic-block-item-${showMore ? 'open' : 'close'}`)}</span>
              </InvisibleButton>
            )}
          </Space>
        </GrayBox>
      </Space>

      {showModalAbandonOffer && (
        <ModalAbandonOffer
          onCancel={hideModalAandonOffer}
          customCancel={hideModalAandonOffer}
          packId={packId}
          getSignaturePack={getSignaturePack}
        />
      )}
    </>
  );
};

export default styled(DocumentUploaded)`
  ${({ theme: { colors } }) => css`
    a {
      color: ${colors.baseColor};
    }
    ${InvisibleButton} {
      color: ${colors.baseColor};

      :hover {
        text-decoration: underline;
      }
    }
  `}
`;

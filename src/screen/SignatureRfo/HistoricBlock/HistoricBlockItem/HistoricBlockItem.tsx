import { DownloadOutlined } from '@ant-design/icons/lib';
import { Col, Row, Space } from 'antd';
import moment from 'moment';
import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css, ThemeContext } from 'styled-components';

import InvisibleButton from '../../../../components/InvisibleButton';
import { ArchivedVersions } from '../../../../interface/signature';
import { BoldBlack } from '../../../../style/utils';
import ValidatorsSigners from '../../StatusValidatorsSigners/ValidatorsSigners';

interface Props {
  className?: string;
  contract: ArchivedVersions;
  packId: string;
  isSupplier: boolean;
}

const DepositDate = styled.div`
  font-size: 0.85rem;
`;

const HistoricBlockItem: FC<Props> = ({ className, contract, packId, isSupplier }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [t] = useTranslation();
  const themeContext = React.useContext(ThemeContext);

  const downloadFileUrl = useCallback(
    (fileId) => `${process.env.REACT_APP_BACKEND_PORTAL_URL}/signature/docSupplier/download/${packId}/${fileId}`,
    [packId],
  );

  return (
    <Space className={className} direction="vertical" size="middle">
      <Space direction="vertical">
        <div className="title">{t(`signature-rfo-historic-block-item-${contract.docSupplierStatus}`)}</div>
        <div>
          {t('signature-rfo-historic-block-item-date')}: {moment(contract.statusUpdateDate).format('DD/MM/YYYY HH:mm')}
        </div>
      </Space>
      <Space direction="vertical">
        <BoldBlack>
          <div>{t('signature-rfo-historic-block-item-reason-cancel-label')}</div>
          <div>{contract.abortReason}</div>
        </BoldBlack>
      </Space>

      {isOpen && (
        <>
          <div>
            <BoldBlack>{t('global-files')}</BoldBlack>
            {contract.docSupplierDocuments.map((file) => (
              <Row justify="space-between" style={{ borderBottom: '1px solid #A6ADB4', padding: '10px 0' }}>
                <Col>
                  <div>{file.originalname}</div>
                </Col>
                <Col style={{ color: themeContext.colors.baseColor }}>
                  <a href={downloadFileUrl(file.filename)}>
                    <Space>
                      <span>{t(`signature-rfo-historic-block-item-download`)}</span>
                      <DownloadOutlined />
                    </Space>
                  </a>
                </Col>
              </Row>
            ))}
          </div>

          {contract.docSupplierMessage && (
            <Space direction="vertical">
              <BoldBlack>{t('signature-rfo-historic-block-item-message-supplier')}</BoldBlack>
              <div>{contract.docSupplierMessage}</div>
            </Space>
          )}

          <DepositDate>
            {t('signature-rfo-historic-block-deposit-date')}:{' '}
            {moment(contract.documentsDepositDate).format('DD/MM/YYYY - HH:mm')}
          </DepositDate>
        </>
      )}
      {isOpen && !isSupplier && (contract.signers.length > 0 || contract.validators.length > 0) && (
        <ValidatorsSigners canSendEmail={false} signers={contract.signers} validators={contract.validators} />
      )}

      <InvisibleButton onClick={() => setIsOpen((s) => !s)}>
        {t(`signature-rfo-historic-block-item-${isOpen ? 'open' : 'close'}`)}
      </InvisibleButton>
    </Space>
  );
};

export default styled(HistoricBlockItem)`
  ${({ theme: { colors } }) => css`
    a {
      ${InvisibleButton} {
        color: ${colors.baseColor};
        :hover {
          text-decoration: underline;
        }
      }

      color: ${colors.baseColor};
    }
  `}
`;

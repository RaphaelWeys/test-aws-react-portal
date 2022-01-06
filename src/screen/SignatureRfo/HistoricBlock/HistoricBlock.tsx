import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import HistoricBlockItem from './HistoricBlockItem';

interface Props {
  className?: string;
  archivedVersions: any[];
  packId: string;
  isSupplier: boolean;
}

const Box = styled.div`
  padding: 1.875rem;
  border: 1px solid #a6adb4;
  transition: all 0.5s ease-in-out;
`;

const HistoricBlock: FC<Props> = ({ className, archivedVersions, packId, isSupplier }) => {
  const [t] = useTranslation();

  return (
    <>
      <Space direction="vertical" size="middle" className={className}>
        <Space direction="vertical">
          <Row>
            <Col>
              <h2>{t('signature-rfo-historic-block-title')}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>{t('signature-rfo-historic-block-title-description')}</div>
            </Col>
          </Row>
        </Space>

        {archivedVersions.map((contract) => (
          <Box>
            <HistoricBlockItem contract={contract} packId={packId} isSupplier={isSupplier} />
          </Box>
        ))}
      </Space>
    </>
  );
};

export default styled(HistoricBlock)`
  ${({ theme: { colors } }) => css`
    .title {
      font-size: 1.5rem;
      font-weight: bold;
      color: ${colors.baseColor};
    }
  `}
`;

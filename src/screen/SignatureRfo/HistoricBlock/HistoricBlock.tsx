import { Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

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
      <Space className={className} direction="vertical" size="middle">
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
            <HistoricBlockItem contract={contract} isSupplier={isSupplier} packId={packId} />
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

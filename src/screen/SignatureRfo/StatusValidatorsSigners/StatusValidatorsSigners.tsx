import React, { FC } from 'react';
import styled from 'styled-components';
import { Col, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { GrayBox } from '../DocumentUploaded/DocumentUploaded.styled';
import { Signers, Validators } from '../../../interface/signature';
import ValidatorsSigners from './ValidatorsSigners';

interface Props {
  className?: string;
  validators: Validators[];
  signers: Signers[];
  packId: string;
  canSendEmail: boolean;
}

const StatusValidatorsSigners: FC<Props> = ({ className, validators, signers, packId, canSendEmail }) => {
  const [t] = useTranslation();

  return (
    <div className={className}>
      <Space direction="vertical">
        <Row>
          <Col>
            <h2>{t(`signature-rfo-status-validators-signers-title`)}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>{t(`signature-rfo-status-validators-signers-description`)}</div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <GrayBox>
              <ValidatorsSigners
                validators={validators}
                signers={signers}
                packId={packId}
                canSendEmail={canSendEmail}
              />
            </GrayBox>
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default styled(StatusValidatorsSigners)``;

import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { Col, message, Row, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { AlignItems, BoldBlack } from '../../../../style/utils';
import { Contact, OrangeCanceled } from '../StatusValidatorsSigners.styled';
import CommonButton from '../../../../components/CommonButton/CommonButton';
import EmailIcon from '../../../../components/icons/EmailIcon';
import { Signers, Validators } from '../../../../interface/signature';
import { SIGNATURE_MEMBER_STATUS } from '../../../../config/app-config';
import useRequest from '../../../../hooks/useRequest';
import { optionsSendEmailAgain } from '../../../../endpoints/signature';

interface Props {
  className?: string;
  validators: Validators[];
  signers: Signers[];
  packId?: string;
  canSendEmail: boolean;
}

const ValidatorsSigners: FC<Props> = ({ className, signers, validators, packId, canSendEmail }) => {
  const [t] = useTranslation();
  const { request: sendEmail } = useRequest(optionsSendEmailAgain());

  const getStatus = useCallback(
    (status, user) => {
      if (status === SIGNATURE_MEMBER_STATUS.MEMBER_WAIT)
        return (
          <Col>
            <span>{t(`signature-rfo-documents-status-member-wait-${user}`)}</span>
          </Col>
        );
      if (status === SIGNATURE_MEMBER_STATUS.MEMBER_INVITED)
        return (
          <Col>
            <span>{t(`signature-rfo-documents-status-member-invited-${user}`)}</span>
          </Col>
        );
      if (status === SIGNATURE_MEMBER_STATUS.MEMBER_SIGNED)
        return (
          <Col>
            <Space align="center" size={50}>
              <span>{t(`signature-rfo-documents-status-member-signed-${user}`)}</span>
              <span>{moment().format('DD/MM/YYYY HH:mm')}</span>
            </Space>
          </Col>
        );
      if (status === SIGNATURE_MEMBER_STATUS.MEMBER_REFUSED)
        return (
          <Col>
            <Space align="center" size="large">
              <OrangeCanceled>
                <Space direction="vertical">
                  <div>{t(`signature-rfo-documents-status-member-refused-${user}`)}</div>
                  <div>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry's
                  </div>
                </Space>
              </OrangeCanceled>
            </Space>
          </Col>
        );
    },
    [t],
  );

  const handleClickSendBackEmail = useCallback(
    (email) => {
      sendEmail({
        data: {
          id: packId,
          email,
        },
      }).then(() => {
        message.success(t('signature-rfo-historic-block-email-sent'));
      });
    },
    [t],
  );

  if (validators.length === 0 && signers.length === 0) {
    return null;
  }

  return (
    <Space direction="vertical" size="large" className={className}>
      <Space direction="vertical">
        <Row style={{ width: '100%' }}>
          <Col span={24}>
            <BoldBlack style={{ paddingBottom: '1rem', borderBottom: '1px solid #a6adb4' }}>
              {t('signature-rfo-contract-pending-validators')}
            </BoldBlack>
          </Col>
        </Row>
        {validators.map((validator) => (
          <AlignItems style={{ padding: '10px 0', borderBottom: '1px solid #A6ADB4', width: '100%' }}>
            <Row justify="space-between" align="middle" style={{ width: '100%' }}>
              <Col>
                <AlignItems noFlexWrap>
                  <Contact>
                    <BoldBlack>
                      <span>{validator.firstname}</span> <span>{validator.lastname}</span>
                    </BoldBlack>
                    <div>
                      {t('signature-rfo-email')}: {validator.email}
                    </div>
                    <div>
                      {t('signature-rfo-phone')}: {validator.phone}
                    </div>
                  </Contact>
                  {getStatus(validator.status, 'validator')}
                </AlignItems>
              </Col>

              {validator.status === SIGNATURE_MEMBER_STATUS.MEMBER_INVITED && canSendEmail && (
                <Col>
                  <AlignItems>
                    <CommonButton type="primary" onClick={() => handleClickSendBackEmail(validator.email)}>
                      <AlignItems space={8}>
                        <EmailIcon />
                        <span>{t('signature-rfo-email-button')}</span>
                      </AlignItems>
                    </CommonButton>
                  </AlignItems>
                </Col>
              )}
            </Row>
          </AlignItems>
        ))}
      </Space>
      <AlignItems direction="column" align="flex-start">
        <Row style={{ width: '100%' }}>
          <Col span={24}>
            <BoldBlack style={{ paddingBottom: '1rem', borderBottom: '1px solid #a6adb4' }}>
              {t('signature-rfo-contract-pending-signer')}
            </BoldBlack>
          </Col>
        </Row>
        {signers.map((signer) => (
          <AlignItems style={{ padding: '10px 0', borderBottom: '1px solid #A6ADB4', width: '100%' }}>
            <Row justify="space-between" align="middle" style={{ width: '100%' }}>
              <Col>
                <AlignItems noFlexWrap>
                  <Contact>
                    <BoldBlack>
                      <span>{signer.firstname}</span> <span>{signer.lastname}</span>
                    </BoldBlack>
                    <div>
                      {t('signature-rfo-email')}: {signer.email}
                    </div>
                    <div>
                      {t('signature-rfo-phone')}: {signer.phone}
                    </div>
                  </Contact>
                  {getStatus(signer.status, 'signer')}
                </AlignItems>
              </Col>

              {signer.status === SIGNATURE_MEMBER_STATUS.MEMBER_INVITED && canSendEmail && (
                <Col>
                  <AlignItems>
                    <CommonButton type="primary" onClick={() => handleClickSendBackEmail(signer.email)}>
                      <AlignItems space={8}>
                        <EmailIcon />
                        <span>{t('signature-rfo-email-button')}</span>
                      </AlignItems>
                    </CommonButton>
                  </AlignItems>
                </Col>
              )}
            </Row>
          </AlignItems>
        ))}
      </AlignItems>
    </Space>
  );
};

export default styled(ValidatorsSigners)``;

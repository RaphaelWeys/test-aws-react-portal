import { Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useTenant } from '../../../context/TenantContext';
import { useUpdateTermAndCondition } from '../../../endpoints/user/useUpdateTermAndCondition';
import { UserInfo } from '../../../interface/user';
import { TextRegular } from '../../../style/utils';
import { getTextWithFunctionInside } from '../../../utils/string';
import GradientButton from '../../GradientButton';
import Hr from '../../Hr';
import TermConditionIcon from '../../icons/TermConditionIcon';
import { Checkbox } from '../../Input';
import InvisibleButton from '../../InvisibleButton';
import SafeHTMLTranslate from '../../SafeHTMLTranslate';
import Modal from '../Modal';

interface Props {
  className?: string;
  handleSuccessLogin: () => void;
  title: string;
  onClose: () => void;
  userInfo: Partial<UserInfo>;
}

enum ModalType {
  GENERAL_CONDITION,
  PRIVACY_POLICY,
}

const ModalTermAndCondition: FC<Props> = ({ className, onClose, title, handleSuccessLogin, userInfo }) => {
  const [t] = useTranslation();
  const { mutate: validateTermAndCondition, isLoading } = useUpdateTermAndCondition();
  const [modalInfo, setModalInfo] = React.useState(null);
  const { register, control, errors, handleSubmit } = useForm();
  const { tenantName } = useTenant();

  React.useEffect(() => {
    register({ name: 'generalCondition' }, { required: true });
    register({ name: 'privacyPolicy' }, { required: true });
  }, [register]);

  const onSubmit = React.useCallback(() => {
    validateTermAndCondition(userInfo.token, {
      onSuccess() {
        handleSuccessLogin();
        onClose();
      },
    });
  }, [handleSuccessLogin, onClose, userInfo.token, validateTermAndCondition]);

  const handleOpenModal = React.useCallback(
    (modal: number) => {
      switch (modal) {
        case ModalType.GENERAL_CONDITION:
          setModalInfo({
            title: t(`modal-cgu-${tenantName}-title`),
            description: `modal-cgu-${tenantName}-description-info`,
          });
          break;
        case ModalType.PRIVACY_POLICY:
          setModalInfo({
            title: t(`modal-rgpd-${tenantName}-title`),
            description: `modal-rgpd-${tenantName}-description-info`,
          });
          break;
        default:
          throw new Error(`This modal is not handled`);
      }
    },
    [t, tenantName],
  );

  return (
    <Modal
      size="small"
      icon={<TermConditionIcon />}
      title={title}
      closable={false}
      maskClosable={false}
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Space direction="vertical" size="large">
          <Row>
            <Col>
              <TextRegular>
                <SafeHTMLTranslate template="modal-cgu-rgpd-description-info" />
              </TextRegular>
            </Col>
          </Row>
          <Hr noTop noBottom />
          <Row gutter={[0, 16]}>
            <Col>
              <Controller as={Checkbox} control={control} name="generalCondition" error={!!errors?.generalCondition}>
                {getTextWithFunctionInside(
                  t('modal-cgu-rgpd-general-condition-1'),
                  [() => handleOpenModal(ModalType.GENERAL_CONDITION), t('modal-cgu-rgpd-general-condition-2')],
                  t('modal-cgu-rgpd-general-condition-3'),
                )}
              </Controller>
            </Col>
            <Col>
              <Controller as={Checkbox} control={control} name="privacyPolicy" error={!!errors?.privacyPolicy}>
                {getTextWithFunctionInside(
                  t('modal-cgu-rgpd-privacy-policy-1'),
                  [() => handleOpenModal(ModalType.PRIVACY_POLICY), t('modal-cgu-rgpd-privacy-policy-2')],
                  t('modal-cgu-rgpd-privacy-policy-3'),
                )}
              </Controller>
            </Col>
          </Row>
          <Hr noTop noBottom />
          <Row>
            <Col>
              <GradientButton type="submit" isLoading={isLoading}>
                {t('term-and-condition-button-valid')}
              </GradientButton>
            </Col>
          </Row>
        </Space>
      </form>

      {modalInfo && (
        <Modal
          title={modalInfo.title}
          size="large"
          onCancel={() => setModalInfo(null)}
          icon={<TermConditionIcon />}
          maskClosable={false}
          closable={false}
        >
          <TextRegular>
            <SafeHTMLTranslate template={modalInfo.description} />
          </TextRegular>

          <Hr />
          <GradientButton onClick={() => setModalInfo(null)}>{t('global-close')}</GradientButton>
        </Modal>
      )}
    </Modal>
  );
};

export default styled(ModalTermAndCondition)`
  ${({ theme: { colors } }) => css`
    ${InvisibleButton} {
      color: ${colors.baseColor};
      display: inline-block;
    }
  `}
`;

import { CloseOutlined } from '@ant-design/icons';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { ThemeContext } from 'styled-components';
import { Controller, UseFormMethods } from 'react-hook-form';
import { Col, Row, Space } from 'antd';

import InputText from '../../../../components/Input/Text';
import CommonButton from '../../../../components/CommonButton';
import InvisibleButton from '../../../../components/InvisibleButton/InvisibleButton';
import { regexEmail } from '../../../../constants';

interface Props {
  className?: string;
  isValidator?: boolean;
  onSubmit: (values: any) => void;
  title: string;
  description: string;
  items: any[];
  handleDeleteItem: (index: number) => void;
  formMethods: UseFormMethods;
  validators: any[];
  signers: any[];
}

const AddNewSignerItem: FC<Props> = ({
  className,
  isValidator,
  onSubmit,
  title,
  description,
  items,
  handleDeleteItem,
  formMethods,
  validators,
  signers,
}) => {
  const [t] = useTranslation();
  const themeContext = React.useContext(ThemeContext);

  const fields = useMemo(
    () => [
      { label: t('modal-edit-user-input-firstname'), name: 'firstname' },
      { label: t('modal-edit-user-input-lastname'), name: 'lastname' },
      { label: t('global-email'), name: 'email' },
      { label: t('global-phone'), name: 'phone' },
    ],
    [t],
  );

  useEffect(() => {
    formMethods.register({ name: 'firstname' }, { required: true });
    formMethods.register({ name: 'lastname' }, { required: true });
    formMethods.register({ name: 'phone' }, { required: true });
  }, [formMethods.register]);

  useEffect(() => {
    formMethods.register(
      { name: 'email' },
      {
        required: true,
        validate: (value) => {
          if (!value.match(regexEmail)) return 'email-not-valid';
          if (
            (isValidator && validators.findIndex((v) => v.email === value) >= 0) ||
            (!isValidator && signers.findIndex((s) => s.email === value) >= 0)
          )
            return 'signature-rfo-email-error-same-list';
          if (
            (isValidator && signers.findIndex((v) => v.email === value) >= 0) ||
            (!isValidator && validators.findIndex((s) => s.email === value) >= 0)
          )
            return 'signature-rfo-email-error-other-list';

          return undefined;
        },
      },
    );
  }, [formMethods.register, isValidator, validators, signers]);

  const handleOnSubmit = useCallback(
    (data) => {
      onSubmit(data);
      formMethods.reset();
    },
    [formMethods, onSubmit],
  );

  return (
    <Space className={className} direction="vertical" size="middle">
      <Space direction="vertical">
        <Row>
          <Col>
            <h2>{title}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <div>{description}</div>
          </Col>
        </Row>
      </Space>

      <Space direction="vertical">
        <form onSubmit={formMethods.handleSubmit(handleOnSubmit)}>
          <Row gutter={16} align="middle">
            {fields.map((field) => (
              <Col span={5}>
                <Controller
                  control={formMethods.control}
                  as={InputText}
                  name={field.name}
                  error={formMethods.errors[field.name]}
                  label={field.label}
                />
              </Col>
            ))}
            <Col>
              <CommonButton htmlType="submit">{t('global-add')}</CommonButton>
            </Col>
          </Row>
        </form>

        {items.length > 0 && (
          <div>
            {items.map((item, index) => (
              <Row
                justify="space-between"
                align="middle"
                style={{ borderBottom: '1px solid #A6ADB4', padding: '10px 0' }}
              >
                <Col>
                  <b>
                    {item.firstname} {item.lastname}
                  </b>
                  <div>
                    {t('signature-rfo-email')}: {item.email}
                  </div>
                  <div>
                    {t('global-phone')}: {item.phone}
                  </div>
                </Col>
                <Col style={{ color: themeContext.colors.baseColor }}>
                  <InvisibleButton onClick={() => handleDeleteItem(index)}>
                    <CloseOutlined />
                  </InvisibleButton>
                </Col>
              </Row>
            ))}
          </div>
        )}
      </Space>
    </Space>
  );
};

export default styled(AddNewSignerItem)``;

import { Col, Row } from 'antd';
import React, { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Hr from '../../../../components/Hr';
import PhoneInput from '../../../../components/Input/Phone';
import Radio from '../../../../components/Input/Radio';
import InputText from '../../../../components/Input/Text';
import { regexEmail } from '../../../../constants';
import { useUserInfo } from '../../../../context/UserInfoContext';
import { TextRegular } from '../../../../style/utils';
import { isBoolean } from '../../../../utils/behavior';

interface Props {
  isCreateForm?: boolean;
}

interface FormData {
  company: string;
  lastName: string;
  firstName: string;
  username: string;
  phone: string;
  multiaccess: {
    clientReference: string;
    isDailyAccount: boolean;
  };
}

const FormStep1: FC<Props> = ({ isCreateForm }) => {
  const [t] = useTranslation();
  const { control, register, errors } = useFormContext<FormData>();
  const { userInfo } = useUserInfo();

  React.useEffect(() => {
    register({ name: 'company' }, { required: true });
    register({ name: 'multiaccess.clientReference' });
    register({ name: 'lastName' }, { required: true });
    register({ name: 'firstName' }, { required: true });
    register(
      { name: 'username' },
      {
        required: true,
        validate: (value: string) => {
          if (!value.match(regexEmail)) {
            return 'email-not-valid';
          }

          return undefined;
        },
      },
    );
    register(
      { name: 'phone' },
      { validate: (value) => (value.length < 3 ? 'global-field-phone-required' : undefined) },
    );
    if (isCreateForm)
      register(
        { name: 'multiaccess.isDailyAccount' },
        { validate: (value) => (!isBoolean(value) ? 'global-field-required' : null) },
      );
  }, [isCreateForm, register]);

  const radioItems = React.useMemo(
    () => [
      { key: 0, value: true, label: t('global-yes') },
      { key: 1, value: false, label: t('global-no') },
    ],
    [t],
  );

  return (
    <>
      <Row gutter={[38, 20]}>
        <Col lg={7} xs={24}>
          <Controller
            as={InputText}
            control={control}
            error={errors.company}
            label={t('multi-access-edit-company-step-1')}
            name="company"
          />
        </Col>
        <Col lg={7} xs={24}>
          <Controller
            as={InputText}
            control={control}
            error={errors?.multiaccess?.clientReference}
            label={t('multi-access-edit-reference-step-1')}
            name="multiaccess.clientReference"
          />
        </Col>
      </Row>

      <Hr />

      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Row gutter={[38, 20]}>
            <Col lg={7} xs={24}>
              <Controller
                as={InputText}
                control={control}
                error={errors.lastName}
                label={t('multi-access-edit-lastname-step-1')}
                name="lastName"
              />
            </Col>
            <Col lg={7} xs={24}>
              <Controller
                as={InputText}
                control={control}
                error={errors.firstName}
                label={t('multi-access-edit-firstname-step-1')}
                name="firstName"
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[38, 20]}>
            <Col lg={7} xs={24}>
              <Controller
                as={InputText}
                control={control}
                disabled={!isCreateForm}
                error={errors.username}
                label={t('multi-access-edit-email-step-1')}
                name="username"
              />
            </Col>
            <Col lg={7} xs={24}>
              <Controller
                as={PhoneInput}
                control={control}
                country={userInfo.language}
                error={errors.phone}
                label={t('multi-access-edit-phone-step-1')}
                name="phone"
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {isCreateForm && (
        <>
          <Hr />

          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Controller
                as={Radio}
                control={control}
                error={errors?.multiaccess?.isDailyAccount}
                items={radioItems}
                label={t('multi-access-edit-demo-step-1')}
                name="multiaccess.isDailyAccount"
              />
            </Col>
            <Col>
              <TextRegular>{t('multi-access-edit-demo-text-step-1')}</TextRegular>
            </Col>
          </Row>

          <Hr />
        </>
      )}
    </>
  );
};

export default FormStep1;

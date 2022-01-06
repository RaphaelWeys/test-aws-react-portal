import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useFormContext } from 'react-hook-form';
import { Col, Row } from 'antd';

import InputText from '../../../../components/Input/Text';
import Hr from '../../../../components/Hr';
import { isBoolean } from '../../../../utils/behavior';
import Radio from '../../../../components/Input/Radio';
import { TextRegular } from '../../../../style/utils';
import { regexEmail } from '../../../../constants';
import PhoneInput from '../../../../components/Input/Phone';
import { useUserInfo } from '../../../../context/UserInfoContext';

interface Props {
  className?: string;
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

  const radioItems = React.useMemo(() => {
    return [
      { key: 0, value: true, label: t('global-yes') },
      { key: 1, value: false, label: t('global-no') },
    ];
  }, [t]);

  return (
    <>
      <Row gutter={[38, 20]}>
        <Col xs={24} lg={7}>
          <Controller
            name="company"
            as={InputText}
            control={control}
            label={t('multi-access-edit-company-step-1')}
            error={errors.company}
          />
        </Col>
        <Col xs={24} lg={7}>
          <Controller
            name="multiaccess.clientReference"
            error={errors?.multiaccess?.clientReference}
            as={InputText}
            control={control}
            label={t('multi-access-edit-reference-step-1')}
          />
        </Col>
      </Row>

      <Hr />

      <Row gutter={[0, 20]}>
        <Col span={24}>
          <Row gutter={[38, 20]}>
            <Col xs={24} lg={7}>
              <Controller
                name="lastName"
                error={errors.lastName}
                as={InputText}
                control={control}
                label={t('multi-access-edit-lastname-step-1')}
              />
            </Col>
            <Col xs={24} lg={7}>
              <Controller
                name="firstName"
                error={errors.firstName}
                as={InputText}
                control={control}
                label={t('multi-access-edit-firstname-step-1')}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[38, 20]}>
            <Col xs={24} lg={7}>
              <Controller
                name="username"
                error={errors.username}
                as={InputText}
                control={control}
                label={t('multi-access-edit-email-step-1')}
                disabled={!isCreateForm}
              />
            </Col>
            <Col xs={24} lg={7}>
              <Controller
                name="phone"
                error={errors.phone}
                as={PhoneInput}
                control={control}
                country={userInfo.language}
                label={t('multi-access-edit-phone-step-1')}
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
                name="multiaccess.isDailyAccount"
                error={errors?.multiaccess?.isDailyAccount}
                as={Radio}
                control={control}
                label={t('multi-access-edit-demo-step-1')}
                items={radioItems}
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

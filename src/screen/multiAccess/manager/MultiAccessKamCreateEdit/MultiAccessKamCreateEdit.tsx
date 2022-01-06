import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import React, { FC } from 'react';
import { Col, Row, Space } from 'antd';

import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import Hr from '../../../../components/Hr';
import MainLayout from '../../../../layout/MainLayout';
import { HeaderOne, TextRegular } from '../../../../style/utils';
import GradientButton from '../../../../components/GradientButton';
import { MultiAccessClientUser } from '../../../../interface/multiAccess';
import InputText from '../../../../components/Input/Text/InputText';
import KamIcon from '../../../../components/icons/KamIcon';
import KamAddIcon from '../../../../components/icons/KamAddIcon';
import { useCreateMultiAccessUser } from '../../../../endpoints/multiAccess/useCreateMultiAccessUser';
import { useUpdateMultiAccessUser } from '../../../../endpoints/multiAccess/useUpdateMultiAccessUser';
import { useCheckUsername } from '../../../../endpoints/registration/useCheckUsername';
import useGetPortalApp from '../../../../hooks/useGetPortalApp';
import { regexEmail } from '../../../../constants';
import PhoneInput from '../../../../components/Input/Phone';
import { useUserInfo } from '../../../../context/UserInfoContext';
import history from '../../../../router/history';
import { Navigation } from '../../../../navigation/index';
import { useParams } from 'react-router';

interface Props {
  isEditMode?: boolean;
  defaultValues?: MultiAccessClientUser;
}

export interface FormDataCreateEditKam {
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
}

const MultiAccessKamCreateEdit: FC<Props> = ({ isEditMode, defaultValues }) => {
  const [t] = useTranslation();
  const { userInfo } = useUserInfo();
  const portalAppUrl = useGetPortalApp();
  const { userId } = useParams<{ userId: string }>();
  const { mutate: createKam, isLoading: createKamLoading } = useCreateMultiAccessUser();
  const { mutate: checkEmailExist, isLoading: checkEmailPending } = useCheckUsername();
  const { mutate: editKam, isLoading: editKamLoading } = useUpdateMultiAccessUser(defaultValues?.id);
  const { register, control, errors, handleSubmit, setError } = useForm<FormDataCreateEditKam>({ defaultValues });

  React.useEffect(() => {
    register({ name: 'firstName' }, { required: true });
    register({ name: 'lastName' }, { required: true });
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
    register({ name: 'phone' }, { required: true });
  }, [register]);

  const onSubmit = React.useCallback(
    async (data) => {
      const values = {
        ...data,
        phone: data.phone.replace(/\+*/, '+'),
        confirmEmailUrl: `${portalAppUrl}/confirmEmail`,
      };
      if (isEditMode) {
        editKam(values, {
          onSuccess() {
            history.push(Navigation.MULTI_ACCESS_DETAILS.replace(':userId', userId));
          },
        });
      } else {
        checkEmailExist(values.username, {
          onSuccess(response) {
            if (response)
              if (response.exists) setError('username', { message: 'register-surname-failed' });
              else
                createKam(values, {
                  onSuccess() {
                    history.push(Navigation.MULTI_ACCESS);
                  },
                });
          },
        });
      }
    },

    [checkEmailExist, createKam, editKam, isEditMode, portalAppUrl, setError, userId],
  );

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox>
        <Space direction="vertical" size={20}>
          <Row align="middle" justify="space-between">
            <Col>
              <Space size="middle">
                {isEditMode ? <KamIcon /> : <KamAddIcon />}
                <HeaderOne>
                  {isEditMode ? t('multi-access-edit-kam-account') : t('multi-access-create-kam-account')}
                </HeaderOne>
              </Space>
            </Col>
          </Row>
          <TextRegular>{t('multi-access-edit-client-description-kam')}</TextRegular>
        </Space>

        <Hr noTop noBottom />

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Row gutter={[38, 20]}>
                <Col xs={24} lg={7}>
                  <Controller
                    name="firstName"
                    error={errors.firstName}
                    as={InputText}
                    control={control}
                    label={t('multi-access-edit-firstname-step-1')}
                  />
                </Col>
                <Col xs={24} lg={7}>
                  <Controller
                    name="lastName"
                    error={errors.lastName}
                    as={InputText}
                    control={control}
                    label={t('multi-access-edit-lastname-step-1')}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[38, 20]}>
                <Col xs={24} lg={7}>
                  <Controller
                    name="username"
                    as={InputText}
                    control={control}
                    label={t('multi-access-edit-email-step-1')}
                    disabled={isEditMode}
                    error={errors.username}
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

          <Hr />

          <Space size="middle">
            <GradientButton onClick={() => history.push(Navigation.MULTI_ACCESS)} variant="outlined">
              {t('global-cancel')}
            </GradientButton>
            <GradientButton type="submit" isLoading={createKamLoading || editKamLoading || checkEmailPending}>
              {isEditMode ? t('global-modify') : t('global-create-account')}
            </GradientButton>
          </Space>
        </form>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default MultiAccessKamCreateEdit;

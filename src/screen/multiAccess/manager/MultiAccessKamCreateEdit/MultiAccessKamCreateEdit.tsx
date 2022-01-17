import { Col, Row, Space } from 'antd';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import GradientButton from '../../../../components/GradientButton';
import Hr from '../../../../components/Hr';
import KamAddIcon from '../../../../components/icons/KamAddIcon';
import KamIcon from '../../../../components/icons/KamIcon';
import PhoneInput from '../../../../components/Input/Phone';
import InputText from '../../../../components/Input/Text/InputText';
import Select from '../../../../components/Select';
import { regexEmail } from '../../../../constants';
import { useUserInfo } from '../../../../context/UserInfoContext';
import { useGetGroupList } from '../../../../endpoints/groups/useGetGroupList';
import { useCreateMultiAccessUser } from '../../../../endpoints/multiAccess/useCreateMultiAccessUser';
import { useUpdateMultiAccessUser } from '../../../../endpoints/multiAccess/useUpdateMultiAccessUser';
import { useCheckUsername } from '../../../../endpoints/registration/useCheckUsername';
import useGetPortalApp from '../../../../hooks/useGetPortalApp';
import { MultiAccessClientUser } from '../../../../interface/multiAccess';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import history from '../../../../router/history';
import { HeaderOne, TextRegular } from '../../../../style/utils';
import GroupItem from '../../group/GroupItem/GroupItem';

interface Props {
  isEditMode?: boolean;
  defaultValues?: MultiAccessClientUser;
}

export interface FormDataCreateEditKam {
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  kamGroupIds: string[];
}

const MultiAccessKamCreateEdit: FC<Props> = ({ isEditMode, defaultValues }) => {
  const [t] = useTranslation();
  const { userInfo } = useUserInfo();
  const portalAppUrl = useGetPortalApp();
  const [group, setGroup] = React.useState('');
  const { userId } = useParams<{ userId: string }>();
  const { data: groups, isLoading: isGroupsLoading } = useGetGroupList();
  const { mutate: createKam, isLoading: createKamLoading } = useCreateMultiAccessUser();
  const { mutate: checkEmailExist, isLoading: checkEmailPending } = useCheckUsername();
  const { mutate: editKam, isLoading: editKamLoading } = useUpdateMultiAccessUser(defaultValues?.id);
  const { register, control, errors, handleSubmit, setError, setValue, watch } = useForm<FormDataCreateEditKam>({
    defaultValues: {
      ...defaultValues,
      kamGroupIds: defaultValues?.kamGroupIds || [],
    },
  });
  const { kamGroupIds } = watch(['kamGroupIds']);

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
    register({ name: 'kamGroupIds' });
  }, [register]);

  const listGroup = React.useMemo(() => {
    if (!groups) {
      return [];
    }

    return groups
      .filter((item) => !kamGroupIds.includes(item.id))
      .map((item) => ({
        key: item.id,
        value: item.id,
        label: item.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [groups, kamGroupIds]);

  const handleAdd = React.useCallback(() => {
    setValue('kamGroupIds', [...kamGroupIds, group]);
    setGroup('');
  }, [kamGroupIds, group, setValue]);

  const handleDeleteMember = React.useCallback(
    (id) => {
      const newKamGroupIds = [...kamGroupIds];
      const memberIndex = newKamGroupIds.findIndex((kamId) => kamId === id);

      newKamGroupIds.splice(memberIndex, 1);
      setValue('kamGroupIds', newKamGroupIds);
    },
    [kamGroupIds, setValue],
  );

  const handleChangeMember = React.useCallback((member) => {
    setGroup(member);
  }, []);

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

  if (isGroupsLoading) {
    return null;
  }

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

        <Hr noBottom noTop />

        <form style={{ width: '100%' }} onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Row gutter={[38, 20]}>
                <Col lg={7} xs={24}>
                  <Controller
                    as={InputText}
                    control={control}
                    error={errors.firstName}
                    label={t('multi-access-edit-firstname-step-1')}
                    name="firstName"
                  />
                </Col>
                <Col lg={7} xs={24}>
                  <Controller
                    as={InputText}
                    control={control}
                    error={errors.lastName}
                    label={t('multi-access-edit-lastname-step-1')}
                    name="lastName"
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
                    disabled={isEditMode}
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

          <Hr />

          <Space direction="vertical" size={25}>
            <Row align="bottom" gutter={[16, 16]}>
              <Col md={8} xs={24}>
                <Select
                  items={listGroup}
                  label={t('multi-access-edit-input-members')}
                  value={group}
                  onChange={handleChangeMember}
                />
              </Col>
              <Col>
                <GradientButton disabled={!group} onClick={handleAdd}>
                  {t('global-add')}
                </GradientButton>
              </Col>
            </Row>

            <Row gutter={24}>
              {(kamGroupIds || [])
                .map((id) => groups.find((group) => group.id === id))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((member) => (
                  <Col md={12} xs={24}>
                    <GroupItem id={member.id} name={member.name} onDelete={handleDeleteMember} />
                  </Col>
                ))}
            </Row>
          </Space>

          <Hr noTop={kamGroupIds.length === 0} />

          <Space size="middle">
            <GradientButton
              variant="outlined"
              onClick={() => {
                if (userId) history.push(Navigation.MULTI_ACCESS_DETAILS.replace(':userId', userId));
                else history.push(Navigation.MULTI_ACCESS);
              }}
            >
              {t('global-cancel')}
            </GradientButton>
            <GradientButton isLoading={createKamLoading || editKamLoading || checkEmailPending} type="submit">
              {isEditMode ? t('global-modify') : t('global-create-account')}
            </GradientButton>
          </Space>
        </form>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default MultiAccessKamCreateEdit;

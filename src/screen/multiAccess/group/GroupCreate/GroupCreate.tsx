import { Col, Row, Space } from 'antd';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import GradientButton from '../../../../components/GradientButton';
import Hr from '../../../../components/Hr';
import KamMultiple from '../../../../components/icons/KamMultipleIcon';
import { Input } from '../../../../components/Input';
import Select from '../../../../components/Select';
import { useCreateGroup } from '../../../../endpoints/groups/useCreateGroup';
import { useGetGroupKam } from '../../../../endpoints/groups/useGetGroupKam';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import history from '../../../../router/history';
import { Label, TextRegular } from '../../../../style/utils';
import GroupItem from '../GroupItem';

const INITIAL_SELECT_VALUE = '-';

const GroupCreate = () => {
  const [t] = useTranslation();
  const [member, setMember] = React.useState(INITIAL_SELECT_VALUE);
  const { register, control, handleSubmit, setValue, watch, errors } = useForm({
    defaultValues: {
      name: '',
      kamIds: [],
    },
  });
  const { kamIds } = watch(['kamIds']);
  const { data: groupKam, isLoading } = useGetGroupKam();
  const { mutate: createGroup, isLoading: isCreateGroupLoading } = useCreateGroup(true);

  React.useEffect(() => {
    register({ name: 'name' }, { required: true });
    register({ name: 'kamIds' });
  }, [register]);

  const listKam = React.useMemo(() => {
    if (!groupKam) {
      return [];
    }

    return groupKam
      .filter((item) => !kamIds.includes(item.id))
      .map((item) => ({
        key: item.id,
        value: item.id,
        label: item.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [groupKam, kamIds]);

  const handleAdd = React.useCallback(() => {
    setValue('kamIds', [...kamIds, member]);
    setMember(INITIAL_SELECT_VALUE);
  }, [kamIds, member, setValue]);

  const handleChangeMember = React.useCallback((member) => {
    setMember(member);
  }, []);

  const handleDeleteMember = React.useCallback(
    (id) => {
      const newKamIds = [...kamIds];
      const memberIndex = newKamIds.findIndex((kamId) => kamId === id);

      newKamIds.splice(memberIndex, 1);
      setValue('kamIds', newKamIds);
    },
    [kamIds, setValue],
  );

  const onSubmit = React.useCallback(
    (data) => {
      createGroup(data, {
        onSuccess() {
          history.push(Navigation.MULTI_ACCESS);
        },
      });
    },
    [createGroup],
  );

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox
        backButtonText={t('multi-access-group-create-back-btn')}
        icon={<KamMultiple />}
        title={t('multi-access-group-create-title')}
        to={Navigation.GROUP_LIST}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextRegular>{t('multi-access-group-create-description')}</TextRegular>
          <Hr />
          <Row>
            <Col md={8} xs={24}>
              <Controller
                as={Input}
                control={control}
                error={errors.name}
                label={t('multi-access-group-create-input-name')}
                name="name"
              />
            </Col>
          </Row>
          <Hr />
          <Space direction="vertical" size={25}>
            <Row align="bottom" gutter={[16, 16]}>
              <Col md={8} xs={24}>
                <Select
                  items={listKam}
                  label={t('multi-access-group-create-input-members')}
                  loading={isLoading}
                  value={member}
                  onChange={handleChangeMember}
                />
              </Col>
              <Col>
                <GradientButton disabled={member === INITIAL_SELECT_VALUE} onClick={handleAdd}>
                  {t('global-add')}
                </GradientButton>
              </Col>
            </Row>

            <Hr noBottom noTop />

            {kamIds.length !== 0 && (
              <>
                <Label>{t('multi-access-group-list-members')}</Label>

                <Row gutter={24}>
                  {kamIds
                    .map((id) => groupKam.find((kam) => kam.id === id))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((member) => (
                        <Col md={12} xs={24}>
                          <GroupItem id={member.id} name={member.name} onDelete={handleDeleteMember} />
                        </Col>
                      ))}
                </Row>
              </>
            )}
          </Space>
          <Hr noTop={kamIds.length === 0} />
          <Space size="middle">
            <GradientButton variant="outlined" onClick={() => history.goBack()}>
              {t('global-close')}
            </GradientButton>
            <GradientButton isLoading={isCreateGroupLoading} type="submit">
              {t('multi-access-group-create-valid')}
            </GradientButton>
          </Space>
        </form>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default GroupCreate;

import { Col, Row, Space } from 'antd';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ThemeContext } from 'styled-components';

import ButtonLink from '../../../../components/ButtonLink';
import GradientButton from '../../../../components/GradientButton';
import Hr from '../../../../components/Hr';
import KamMultiple from '../../../../components/icons/KamMultipleIcon';
import { Input } from '../../../../components/Input';
import ModalDeleteGroup from '../../../../components/Modal/ModalDeleteGroup';
import Select from '../../../../components/Select';
import { useCreateGroup } from '../../../../endpoints/groups/useCreateGroup';
import { useGetGroupDetails } from '../../../../endpoints/groups/useGetGroupDetails';
import { useGetGroupKam } from '../../../../endpoints/groups/useGetGroupKam';
import MainLayout from '../../../../layout/MainLayout';
import WrapperWhiteBox from '../../../../layout/WrapperWhiteBox';
import { Navigation } from '../../../../navigation';
import history from '../../../../router/history';
import { Label, TextRegular, WarningText } from '../../../../style/utils';
import GroupItem from '../GroupItem';

const INITIAL_SELECT_VALUE = '-';

const GroupDetails = () => {
  const themeContext = React.useContext(ThemeContext);
  const [showModalDelete, setShowModalDelete] = React.useState(false);
  const [t] = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = React.useState(INITIAL_SELECT_VALUE);
  const { register, control, handleSubmit, setValue, watch, errors, reset } = useForm({
    defaultValues: {
      name: '',
      kamIds: [],
    },
  });
  const { kamIds } = watch(['kamIds']);
  const { data: groupDetails, isLoading: isGroupDetailsLoading } = useGetGroupDetails(id as string);
  const { data: allKamsList, isLoading: isKamListLoading } = useGetGroupKam();
  const { mutate: createGroup, isLoading: isCreateGroupLoading } = useCreateGroup(false, id as string);

  React.useEffect(() => {
    register({ name: 'name' }, { required: true });
    register({ name: 'kamIds' });
  }, [register]);

  React.useEffect(() => {
    if (groupDetails) {
      reset({
        name: groupDetails.name,
        kamIds: groupDetails.kamIds,
      });
    }
  }, [groupDetails, reset]);

  const listKam = React.useMemo(() => {
    if (!allKamsList) {
      return [];
    }

    return allKamsList
      .filter((item) => !kamIds.includes(item.id))
      .map((item) => ({
        key: item.id,
        value: item.id,
        label: item.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allKamsList, kamIds]);

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
          history.push(Navigation.GROUP_LIST);
        },
      });
    },
    [createGroup],
  );

  if (isGroupDetailsLoading || isKamListLoading) {
    return null;
  }

  return (
    <MainLayout hasBg={false}>
      <WrapperWhiteBox
        backButtonText={t('multi-access-group-details-back-btn')}
        icon={<KamMultiple />}
        preTitle={t('multi-access-group-details-pre-title')}
        title={groupDetails.name}
        to={Navigation.GROUP_LIST}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextRegular>{t('multi-access-group-details-description')}</TextRegular>
          <Hr />
          <Space direction="vertical" size={25}>
            <Row align="top" gutter={[40, 16]}>
              <Col md={8} xs={24}>
                <Controller
                  as={Input}
                  control={control}
                  error={errors.name}
                  label={t('multi-access-group-details-input-name')}
                  name="name"
                />
              </Col>
              <Col md={16} xs={24}>
                <Row align="bottom" gutter={[16, 16]}>
                  <Col md={11} xs={24}>
                    <Select
                      items={listKam}
                      label={t('multi-access-group-details-input-members')}
                      loading={isKamListLoading}
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
              </Col>
            </Row>

            <Hr noBottom noTop />

            {kamIds.length !== 0 && (
              <>
                <Label>{t('multi-access-group-list-members')}</Label>

                <Row gutter={24}>
                  {kamIds
                    .map((id) => allKamsList.find((kam) => kam.id === id))
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
          <Row align="middle" gutter={[0, 16]} justify="space-between">
            <Col>
              <Space size="middle">
                <GradientButton variant="outlined" onClick={() => history.goBack()}>
                  {t('global-close')}
                </GradientButton>
                <GradientButton isLoading={isCreateGroupLoading} type="submit">
                  {t('multi-access-group-create-valid')}
                </GradientButton>
              </Space>
            </Col>
            <Col>
              <ButtonLink color={themeContext.colors.orange} onClick={() => setShowModalDelete(true)}>
                <WarningText>{t('multi-access-group-details-delete-group')}</WarningText>
              </ButtonLink>
            </Col>
          </Row>
        </form>
      </WrapperWhiteBox>

      {showModalDelete && (
        <ModalDeleteGroup groupId={id} title={groupDetails.name} onClose={() => setShowModalDelete(false)} />
      )}
    </MainLayout>
  );
};

export default GroupDetails;

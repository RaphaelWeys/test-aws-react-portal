import { Space } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { AdminLanguageItems } from '../../../config/app-config';
import { useCreateSupplier } from '../../../endpoints/admin/suppliers/useCreateSupplier';
import { useUpdateSupplier } from '../../../endpoints/admin/suppliers/useUpdateSupplier';
import { Supplier } from '../../../interface/supplier';
import RichEditorExample from '../../../screen/Admin/components/Wysiwyg';
import { Margin } from '../../../style/utils';
import { formatBooleanToString, formatStringToBoolean, i18nItemsForCountry } from '../../../utils/behavior';
import CommonButton from '../../CommonButton';
import InputText from '../../Input/Text';
import TextArea from '../../Input/TextArea';
import Select from '../../Select';
import Modal from '../Modal';
import { FormData } from './ModalEditSupplier.interface';

type IProps = {
  className?: string;
  customCancel: () => void;
  selectedSupplier?: Supplier;
  handleOnSuccess: () => void;
} & ModalProps;

const ModalEditSupplier: FC<IProps> = ({
  className,
  customCancel,
  selectedSupplier,
  handleOnSuccess,
  ...modalProps
}) => {
  const { control, register, handleSubmit, errors, reset } = useForm<FormData>();
  const [greenMixDescriptionValue, setGreenMixDescriptionValue] = useState('');
  const { mutate: createSupplier, isLoading: createLoading } = useCreateSupplier();
  const { mutate: updateSupplier, isLoading: updateLoading } = useUpdateSupplier(selectedSupplier?.id);

  const itemsYes = useMemo(
    () => [
      { label: 'Yes', value: 'true', key: '0' },
      { label: 'No', value: 'false', key: '1' },
    ],
    [],
  );

  useEffect(() => {
    register({ name: 'name' }, { required: true });
    register({ name: 'country' }, { required: true });
    register({ name: 'language' }, { required: true });
    register({ name: 'description' }, { required: true });
    register({ name: 'providePower' }, { required: true });
    register({ name: 'provideGreenPower' }, { required: true });
    register({ name: 'provideGas' }, { required: true });
    register({ name: 'demo' }, { required: true });
    register({ name: 'scoreDisabled' }, { required: true });
    register({ name: 'imageUrl' }, { required: true });
    register({ name: 'website' }, { required: true });
    register({ name: 'greenMixPercent' });
  }, [register]);

  useEffect(() => {
    if (selectedSupplier) {
      reset(formatBooleanToString(selectedSupplier));
      setGreenMixDescriptionValue(selectedSupplier.greenMixDescription || '');
    }
  }, [selectedSupplier, reset]);

  const onSubmit = useCallback(
    (data: FormData) => {
      let greenMixPercent: number | undefined;

      if (data.greenMixPercent) greenMixPercent = parseFloat(parseFloat(data.greenMixPercent.toString()).toFixed(2));

      const updatedData = formatStringToBoolean({
        ...selectedSupplier,
        ...data,
        greenMixPercent,
        greenMixDescription: greenMixDescriptionValue,
      });

      if (selectedSupplier) {
        updateSupplier(updatedData, {
          onSuccess() {
            handleOnSuccess();
          },
        });
      } else
        createSupplier(updatedData, {
          onSuccess() {
            handleOnSuccess();
          },
        });
    },
    [updateSupplier, createSupplier, handleOnSuccess, selectedSupplier, greenMixDescriptionValue],
  );

  return (
    <Modal className={className} footer={false} getContainer={false} size="large" {...modalProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Space direction="vertical">
          <Space size="large">
            <Controller
              as={InputText}
              control={control}
              error={errors.name}
              htmlFor="name"
              label="Supplier name"
              name="name"
            />
            <div />
          </Space>
          <Space size="large">
            <Controller
              as={Select}
              control={control}
              error={errors.country}
              items={i18nItemsForCountry()}
              label="Country"
              name="country"
            />
            <Controller
              as={Select}
              control={control}
              error={errors.language}
              items={AdminLanguageItems}
              label="Language"
              name="language"
            />
          </Space>
          <Space size="large">
            <Controller
              as={TextArea}
              control={control}
              error={errors.description}
              htmlFor="description"
              label="Description"
              name="description"
            />
          </Space>
          <Space size="large">
            <Controller
              as={Select}
              control={control}
              error={errors.providePower}
              items={itemsYes}
              label="Provide Power"
              name="providePower"
            />
            <Controller
              as={Select}
              control={control}
              error={errors.provideGreenPower}
              items={itemsYes}
              label="Provide Green power"
              name="provideGreenPower"
            />
          </Space>
          <Space size="large">
            <Controller
              as={Select}
              control={control}
              error={errors.provideGas}
              items={itemsYes}
              label="Provide Gas"
              name="provideGas"
            />
            <Controller
              as={Select}
              control={control}
              error={errors.demo}
              items={itemsYes}
              label="Demo mode for this provider"
              name="demo"
            />
          </Space>
          <Space size="large">
            <Controller
              as={Select}
              control={control}
              error={errors.scoreDisabled}
              items={itemsYes}
              label="Cerved score disabled"
              name="scoreDisabled"
            />
            <div />
          </Space>
          <Space size="large">
            <Controller
              as={InputText}
              control={control}
              error={errors.imageUrl}
              htmlFor="imageUrl"
              label="Image url"
              name="imageUrl"
            />
            <Controller
              as={InputText}
              control={control}
              error={errors.website}
              htmlFor="website"
              label="Web site"
              name="website"
            />
          </Space>
          <Space size="large">
            <Controller
              as={InputText}
              control={control}
              error={errors.greenMixPercent}
              htmlFor="greenMixPercent"
              label="Green mix percent"
              name="greenMixPercent"
              step=".01"
              type="number"
            />
            <div />
          </Space>

          <RichEditorExample setValue={setGreenMixDescriptionValue} value={greenMixDescriptionValue} />
        </Space>

        <Margin mt={10}>
          <Space size="middle">
            <CommonButton onClick={customCancel}>Annuler</CommonButton>
            <CommonButton htmlType="submit" loading={createLoading || updateLoading} type="primary">
              Save
            </CommonButton>
          </Space>
        </Margin>
      </form>
    </Modal>
  );
};

export default styled(ModalEditSupplier)``;

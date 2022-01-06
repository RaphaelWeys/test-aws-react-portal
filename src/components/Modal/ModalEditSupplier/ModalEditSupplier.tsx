import { ModalProps } from 'antd/lib/modal';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';

import { AdminLanguageItems } from '../../../config/app-config';
import { useCreateSupplier } from '../../../endpoints/admin/suppliers/useCreateSupplier';
import { useUpdateSupplier } from '../../../endpoints/admin/suppliers/useUpdateSupplier';
import { Supplier } from '../../../interface/supplier';
import RichEditorExample from '../../../screen/Admin/components/Wysiwyg';
import { AlignItems, Margin } from '../../../style/utils';
import { i18nItemsForCountry, formatBooleanToString, formatStringToBoolean } from '../../../utils/behavior';
import CommonButton from '../../CommonButton';
import InputText from '../../Input/Text';
import TextArea from '../../Input/TextArea';
import Select from '../../Select';
import Modal from '../Modal';

type IProps = {
  className?: string;
  customCancel: () => void;
  selectedSupplier?: Supplier;
  handleOnSuccess: () => void;
} & ModalProps;

export interface FormData {
  name: string;
  country: string;
  language: string;
  description: string;
  providePower: string;
  provideGreenPower: string;
  provideGas: string;
  demo: string;
  scoreDisabled: string;
  imageUrl: string;
  website: string;
  greenMixPercent?: number;
}

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
    <Modal className={className} getContainer={false} footer={false} size="large" {...modalProps}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AlignItems direction="column" align="stretch">
          <AlignItems space={24} flex>
            <Controller
              as={InputText}
              name="name"
              control={control}
              error={errors.name}
              label="Supplier name"
              htmlFor="name"
            />
            <div />
          </AlignItems>
          <AlignItems space={24} flex>
            <Controller
              as={Select}
              name="country"
              control={control}
              error={errors.country}
              label="Country"
              items={i18nItemsForCountry()}
            />
            <Controller
              as={Select}
              name="language"
              control={control}
              error={errors.language}
              label="Language"
              items={AdminLanguageItems}
            />
          </AlignItems>
          <AlignItems flex>
            <Controller
              as={TextArea}
              name="description"
              htmlFor="description"
              control={control}
              error={errors.description}
              label="Description"
            />
          </AlignItems>
          <AlignItems space={24} flex>
            <Controller
              as={Select}
              name="providePower"
              control={control}
              error={errors.providePower}
              label="Provide Power"
              items={itemsYes}
            />
            <Controller
              as={Select}
              name="provideGreenPower"
              control={control}
              error={errors.provideGreenPower}
              label="Provide Green power"
              items={itemsYes}
            />
          </AlignItems>
          <AlignItems space={24} flex>
            <Controller
              as={Select}
              name="provideGas"
              control={control}
              error={errors.provideGas}
              label="Provide Gas"
              items={itemsYes}
            />
            <Controller
              as={Select}
              name="demo"
              control={control}
              error={errors.demo}
              label="Demo mode for this provider"
              items={itemsYes}
            />
          </AlignItems>
          <AlignItems space={24} flex>
            <Controller
              as={Select}
              name="scoreDisabled"
              control={control}
              error={errors.scoreDisabled}
              label="Cerved score disabled"
              items={itemsYes}
            />
            <div />
          </AlignItems>
          <AlignItems space={24} flex>
            <Controller
              as={InputText}
              name="imageUrl"
              control={control}
              error={errors.imageUrl}
              label="Image url"
              htmlFor="imageUrl"
            />
            <Controller
              as={InputText}
              name="website"
              control={control}
              error={errors.website}
              label="Web site"
              htmlFor="website"
            />
          </AlignItems>
          <AlignItems space={24} flex>
            <Controller
              as={InputText}
              name="greenMixPercent"
              control={control}
              error={errors.greenMixPercent}
              label="Green mix percent"
              htmlFor="greenMixPercent"
              type="number"
              step=".01"
            />
            <div />
          </AlignItems>

          <RichEditorExample setValue={setGreenMixDescriptionValue} value={greenMixDescriptionValue} />
        </AlignItems>

        <Margin mt={10}>
          <AlignItems space={15} justify="flex-end">
            <CommonButton onClick={customCancel}>Annuler</CommonButton>
            <CommonButton htmlType="submit" type="primary" loading={createLoading || updateLoading}>
              Save
            </CommonButton>
          </AlignItems>
        </Margin>
      </form>
    </Modal>
  );
};

export default styled(ModalEditSupplier)``;

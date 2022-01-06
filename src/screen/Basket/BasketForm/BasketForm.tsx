import { useStateMachine } from 'little-state-machine';
import React, { FC, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import GradientButton from '../../../components/GradientButton/GradientButton';
import { Input } from '../../../components/Input';
import SelectCountry from '../../../components/SelectCountry';
import { regexEmail } from '../../../constants';
import prefixVAT from '../../../constants/prefixVAT';
import { useUpdateBillingInfo } from '../../../endpoints/basket/useUpdateBillingInfo';
import RectangleBox from '../../../layout/RectangleBox/RectangleBox';
import { updateBasketForm } from '../../../StoreForm/updateState';
import { useOrder } from '../BasketWrapper';
import { ContainerButton, FormStyled, WrapperForm } from './BasketForm.styled';
import { Col, Row } from 'antd';

interface Props {
  className?: string;
  previousStep: () => void;
  nextStep: () => void;
}

export interface FormData {
  company: string;
  name: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  vatNumber: string;
}

const BasketForm: FC<Props> = ({ className, previousStep, nextStep }) => {
  const [t] = useTranslation();
  const { order } = useOrder();
  const { actions, state } = useStateMachine({ updateBasketForm });
  const { control, register, handleSubmit, errors } = useForm<FormData>({ defaultValues: state.basket });
  const { mutate: updateBillingInfo } = useUpdateBillingInfo();

  useEffect(() => {
    register({ name: 'company' }, { required: true });
    register({ name: 'name' }, { required: true });
    register({ name: 'email' }, { required: true, pattern: regexEmail });
    register({ name: 'address' }, { required: true });
    register({ name: 'postalCode' }, { required: true });
    register({ name: 'city' }, { required: true });
    register({ name: 'country' }, { required: true });
    register(
      { name: 'vatNumber' },
      {
        validate: async (value: string) => {
          if (!value) {
            return undefined;
          }
          if (!value.match(/^[a-zA-Z]{2}/)) {
            return 'basket-form-vtaNumber-start-letter';
          }
          if (!prefixVAT.includes(value.toUpperCase().substring(0, 2))) {
            return 'basket-form-vtaNumber-two-letter';
          }
          if (value.length < 7) {
            return 'basket-form-vtaNumber-min-letter';
          }
          return undefined;
        },
      },
    );
  }, [register]);

  const onSubmit = (data: FormData) => {
    actions.updateBasketForm(data);
    updateBillingInfo(
      { orderId: order.id, billingInfo: { ...data } },
      {
        onSuccess() {
          nextStep();
        },
      },
    );
  };

  return (
    <RectangleBox showLogo={false} className={className} title={t('basket-form-title')}>
      <FormStyled onSubmit={handleSubmit(onSubmit)}>
        <WrapperForm>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Controller
                as={Input}
                name="company"
                label={t('basket-form-company')}
                control={control}
                type="text"
                error={errors?.company}
                htmlFor="company"
                autoFocus
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                name="name"
                label={t('basket-form-full-name')}
                control={control}
                type="text"
                error={errors?.name}
                htmlFor="name"
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                name="email"
                htmlFor="email"
                label={t('basket-form-email')}
                control={control}
                type="email"
                error={errors?.email}
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                name="address"
                htmlFor="address"
                label={t('basket-form-address')}
                control={control}
                type="text"
                error={errors?.address}
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                name="postalCode"
                htmlFor="postalCode"
                label={t('basket-form-postalCode')}
                control={control}
                type="text"
                error={errors?.postalCode}
              />
            </Col>
            <Col span={24}>
              <Controller
                as={SelectCountry}
                name="country"
                label={t('basket-form-country')}
                control={control}
                placeholder={t('basket-form-placeholder-country')}
                error={errors?.country}
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                name="city"
                htmlFor="city"
                label={t('basket-form-city')}
                control={control}
                type="text"
                error={errors?.city}
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                name="vatNumber"
                htmlFor="vatNumber"
                label={t('basket-form-vtaNumber')}
                control={control}
                type="text"
                error={errors?.vatNumber}
              />
            </Col>
          </Row>
        </WrapperForm>
        <ContainerButton>
          <GradientButton onClick={previousStep} noGradient variant="outlined" fullWidth>
            {t('global-back')}
          </GradientButton>
          <GradientButton type="submit" fullWidth>
            {t('global-next')}
          </GradientButton>
        </ContainerButton>
      </FormStyled>
    </RectangleBox>
  );
};

export default styled(BasketForm)``;

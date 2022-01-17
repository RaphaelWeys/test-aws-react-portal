import { Col, Row } from 'antd';
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
import { useOrder } from '../../../context/OrderContext';
import { useUpdateBillingInfo } from '../../../endpoints/basket/useUpdateBillingInfo';
import RectangleBox from '../../../layout/RectangleBox/RectangleBox';
import { updateBasketForm } from '../../../StoreForm/updateState';
import { FormData } from './BasketForm.interface';
import { ContainerButton, FormStyled, WrapperForm } from './BasketForm.styled';

interface Props {
  className?: string;
  previousStep: () => void;
  nextStep: () => void;
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
    <RectangleBox className={className} showLogo={false} title={t('basket-form-title')}>
      <FormStyled onSubmit={handleSubmit(onSubmit)}>
        <WrapperForm>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Controller
                autoFocus
                as={Input}
                control={control}
                error={errors?.company}
                htmlFor="company"
                label={t('basket-form-company')}
                name="company"
                type="text"
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                control={control}
                error={errors?.name}
                htmlFor="name"
                label={t('basket-form-full-name')}
                name="name"
                type="text"
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                control={control}
                error={errors?.email}
                htmlFor="email"
                label={t('basket-form-email')}
                name="email"
                type="email"
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                control={control}
                error={errors?.address}
                htmlFor="address"
                label={t('basket-form-address')}
                name="address"
                type="text"
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                control={control}
                error={errors?.postalCode}
                htmlFor="postalCode"
                label={t('basket-form-postalCode')}
                name="postalCode"
                type="text"
              />
            </Col>
            <Col span={24}>
              <Controller
                as={SelectCountry}
                control={control}
                error={errors?.country}
                label={t('basket-form-country')}
                name="country"
                placeholder={t('basket-form-placeholder-country')}
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                control={control}
                error={errors?.city}
                htmlFor="city"
                label={t('basket-form-city')}
                name="city"
                type="text"
              />
            </Col>
            <Col span={24}>
              <Controller
                as={Input}
                control={control}
                error={errors?.vatNumber}
                htmlFor="vatNumber"
                label={t('basket-form-vtaNumber')}
                name="vatNumber"
                type="text"
              />
            </Col>
          </Row>
        </WrapperForm>
        <ContainerButton>
          <GradientButton fullWidth noGradient variant="outlined" onClick={previousStep}>
            {t('global-back')}
          </GradientButton>
          <GradientButton fullWidth type="submit">
            {t('global-next')}
          </GradientButton>
        </ContainerButton>
      </FormStyled>
    </RectangleBox>
  );
};

export default styled(BasketForm)``;

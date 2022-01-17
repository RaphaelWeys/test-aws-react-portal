import { CloseOutlined } from '@ant-design/icons';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useStateMachine } from 'little-state-machine';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import InvisibleButton from '../../../components/InvisibleButton';
import { useOrder } from '../../../context/OrderContext';
import { useScroll } from '../../../context/ScrollContext';
import useContactUs from '../../../hooks/useContactUs';
import basketState from '../../../StoreForm/basketState';
import { updateBasketForm } from '../../../StoreForm/updateState';
import { getQueryParameters } from '../../../utils/url';
import BasketForm from '../BasketForm';
import BasketItem from '../BasketItem';
import BasketPay from '../BasketPay';
import BasketValidate from '../BasketValidate';
import { CancelIcon, ContactUs, Line, Logo, Step, Title, WrapperSteps } from './AppBasket.styled';

interface Props {
  className?: string;
  icon: string;
}

let stripePromise: Promise<Stripe | null>;
if (process.env.REACT_APP_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
}

const AppBasket: FC<Props> = ({ className, icon }) => {
  const [t] = useTranslation();
  const { callback } = getQueryParameters();
  const { order } = useOrder();
  const scrollRef = useScroll();
  const { actions } = useStateMachine({ updateBasketForm });
  const contactUsLink = useContactUs();
  const [isPaymentValidated, setIsPaymentValidated] = useState(false);
  const [actualStep, setActualStep] = useState(0);
  const steps = [
    { id: 0, label: t('basket-title-step-1') },
    { id: 1, label: t('basket-title-step-2') },
    { id: 2, label: t('basket-title-step-3') },
  ];

  useEffect(() => {
    if (scrollRef) {
      scrollRef.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [scrollRef, actualStep]);

  const handleClickCancel = useCallback(() => {
    actions.updateBasketForm(basketState);
    window.location.assign(callback as string);
  }, [actions, callback]);

  return (
    <div className={className}>
      {isPaymentValidated ? (
        <BasketValidate
          text={
            order?.app === 'tender'
              ? t('basket-validate-marketplace-content')
              : t('basket-validate-optimization-content')
          }
        />
      ) : (
        <>
          <CancelIcon>
            <InvisibleButton onClick={handleClickCancel}>
              {t('basket-cancel')} <CloseOutlined />
            </InvisibleButton>
          </CancelIcon>

          <Logo alt="" src={icon} />
          <Title>{order?.app === 'tender' ? t('basket-title-marketplace') : t('basket-title-optimization')}</Title>
          <WrapperSteps>
            <Line />
            {steps.map((step) => (
              <Step isActive={step.id === actualStep} key={step.id}>
                {step.label}
              </Step>
            ))}
          </WrapperSteps>
          {actualStep === 0 && <BasketItem nextStep={() => setActualStep(1)} />}
          {actualStep === 1 && <BasketForm nextStep={() => setActualStep(2)} previousStep={() => setActualStep(0)} />}
          <Elements stripe={stripePromise}>
            {actualStep === 2 && (
              <BasketPay nextStep={() => setIsPaymentValidated(true)} previousStep={() => setActualStep(1)} />
            )}
          </Elements>
        </>
      )}
      <ContactUs>
        <span>{t('basket-item-contact-1')}</span>{' '}
        <InvisibleButton
          onClick={() => {
            window.location.assign(contactUsLink);
          }}
        >
          <span>{t('basket-item-contact-2')}</span>
        </InvisibleButton>{' '}
        <span>{t('basket-item-contact-3')}</span>
      </ContactUs>
    </div>
  );
};

export default styled(AppBasket)`
  padding: 0 20px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

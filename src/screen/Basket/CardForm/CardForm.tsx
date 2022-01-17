import { CardElement } from '@stripe/react-stripe-js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface Props {
  className?: string;
}

const CardForm: FC<Props> = ({ className }) => {
  const [t] = useTranslation();

  return (
    <div className={className}>
      <p>{t('basket-card-form')}</p> <CardElement options={{ hidePostalCode: true }} />
    </div>
  );
};

export default styled(CardForm)`
  > :first-child {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .StripeElement {
  box-sizing: border-box;

  height: 40px;

  padding: 10px 12px;

  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #f7f7f7;

  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}

.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}

.StripeElement--invalid {
  border-color: #fa755a;
}

.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
`;

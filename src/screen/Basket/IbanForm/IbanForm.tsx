import { IbanElement } from '@stripe/react-stripe-js';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface Props {
  className?: string;
}

const IbanForm: FC<Props> = ({ className }) => {
  const [t] = useTranslation();

  const IBAN_STYLE = {
    base: {
      color: '#32325d',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#32325d',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
      ':-webkit-autofill': {
        color: '#fa755a',
      },
    },
  };

  const IBAN_ELEMENT_OPTIONS = {
    supportedCountries: ['SEPA'],
    // Elements can use a placeholder as an example IBAN that reflects
    // the IBAN format of your customer's country. If you know your
    // customer's country, we recommend that you pass it to the Element as the
    // placeholderCountry.
    placeholderCountry: 'IT',
    style: IBAN_STYLE,
  };

  return (
    <div className={className}>
      <p>{t('basket-iban-form')}</p> <IbanElement options={IBAN_ELEMENT_OPTIONS} />
    </div>
  );
};

export default styled(IbanForm)`
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

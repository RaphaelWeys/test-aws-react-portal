import { LoadingOutlined } from '@ant-design/icons';
import { CardElement, IbanElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { Spin } from 'antd';
import { useStateMachine } from 'little-state-machine';
import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import creditCardIcon from '../../../assets/picto-mode-de-paiement-carte.svg';
import SepaIcon from '../../../assets/picto-mode-de-paiement-SEPA.svg';
import GradientButton from '../../../components/GradientButton/GradientButton';
import { useUpdateIntentStripe } from '../../../endpoints/basket/useUpdateIntentStripe';
import { useValidatePayment } from '../../../endpoints/basket/useValidatePayment';
import RectangleBox from '../../../layout/RectangleBox';
import basketState from '../../../StoreForm/basketState';
import { updateBasketForm } from '../../../StoreForm/updateState';
import { getCurrencyFormatted } from '../../../utils/number';
import { ContainerButton } from '../BasketForm/BasketForm.styled';
import { useOrder } from '../BasketWrapper';
import CardForm from '../CardForm';
import IbanForm from '../IbanForm';
import { Options, SepaText, WrapperCardElement, WrapperForm } from './BasketPay.styled';
import OptionPayItem from './OptionPayItem';
import { getQueryParameters } from '../../../utils/url';

interface Props {
  className?: string;
  previousStep?: () => void;
  nextStep: () => void;
}

interface IErrorPayment {
  className?: string;
  errorMessage: string;
}

const ErrorPayment = styled(({ className, errorMessage }: IErrorPayment) => {
  const [t] = useTranslation();

  return (
    <div className={className}>
      <h2>{t('basket-payment-error-title')}</h2>
      <p>{t('basket-payment-error-content')}</p>
      <p>({errorMessage})</p>
    </div>
  );
})`
  margin-top: 20px;

  h2 {
    color: #f57313;
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  p {
    color: #f57313;
    text-align: center;
  }

  > :last-child {
    text-align: center;
    color: rgba(0, 0, 0, 0.65);
    font-size: 0.7rem;
  }
`;

const antIcon = <LoadingOutlined style={{ fontSize: '6.25rem' }} spin />;

const OPTION_PAYMENT = {
  SEPA: 0,
  CREDIT_CARD: 1,
};

const BasketPay: FC<Props> = ({ className, previousStep, nextStep }) => {
  const [t] = useTranslation();
  const { order } = useOrder();
  const { callback } = getQueryParameters();
  const { actions, state } = useStateMachine({ updateBasketForm });
  const [selectedOption, setSelectedOption] = useState(OPTION_PAYMENT.SEPA);
  const [formStripePending, setFormStripePending] = useState(false);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const isFreeCoupon = order.itemsAmount === order.couponValue;

  const { mutate: validPaymentBackEnd } = useValidatePayment();
  const { mutate: getIntentStripe, data: intentStripe } = useUpdateIntentStripe();

  useEffect(() => {
    const paymentMethod = isFreeCoupon ? 'free' : selectedOption === OPTION_PAYMENT.CREDIT_CARD ? 'card' : 'sepa_debit';

    getIntentStripe({
      orderId: order.id,
      paymentMethod,
    });
  }, [selectedOption, order.id, isFreeCoupon, getIntentStripe]);

  const handleContinueClick = async () => {
    if (isFreeCoupon) {
      validPaymentBackEnd(undefined, {
        onSuccess() {
          actions.updateBasketForm(basketState);
          window.location.assign(callback as string);
        },
      });
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const cardElementStripe = elements.getElement(CardElement);
    const iban = elements.getElement(IbanElement);

    if (!intentStripe) {
      return;
    }
    setFormStripePending(true);
    let result;

    if (selectedOption === OPTION_PAYMENT.SEPA && iban) {
      result = await stripe.confirmSepaDebitPayment(intentStripe.clientSecret, {
        payment_method: {
          sepa_debit: iban,
          billing_details: {
            name: state.name,
            email: state.email,
          },
        },
      });
    } else if (cardElementStripe) {
      result = await stripe.confirmCardPayment(intentStripe.clientSecret, {
        payment_method: {
          card: cardElementStripe,
        },
      });
    }

    if (result?.error) {
      setPaymentErrorMsg(result.error.message || '');
      setFormStripePending(false);
    } else if (result?.paymentIntent?.status === 'succeeded' || selectedOption === OPTION_PAYMENT.SEPA) {
      validPaymentBackEnd(undefined, {
        onSuccess() {
          actions.updateBasketForm(basketState);
          nextStep();
        },
      });
    }
  };

  if (!intentStripe) {
    return <Spin indicator={antIcon} />;
  }

  return (
    <RectangleBox showLogo={false} className={className}>
      <h1>
        {t('basket-pay-title')} {getCurrencyFormatted(intentStripe.amountToPay)}
      </h1>
      {Boolean(intentStripe.vatAmount) && (
        <h2>
          {t('basket-pay-included-tva')} {getCurrencyFormatted(intentStripe.vatAmount)}
        </h2>
      )}
      {!isFreeCoupon && (
        <>
          <Options>
            <OptionPayItem
              icon={SepaIcon}
              title={t('basket-pay-SEPA')}
              text={t('basket-pay-SEPA-content')}
              onClick={() => {
                setSelectedOption(0);
              }}
              isSelected={selectedOption === 0}
              disabled={selectedOption === 1 && formStripePending}
            />
            <OptionPayItem
              icon={creditCardIcon}
              title={t('basket-pay-credit-card')}
              text={t('basket-pay-credit-card-content')}
              onClick={() => {
                setSelectedOption(1);
              }}
              isSelected={selectedOption === 1}
              disabled={selectedOption === 0 && formStripePending}
            />
          </Options>

          <WrapperForm>
            <Spin spinning={formStripePending}>
              {selectedOption === OPTION_PAYMENT.SEPA ? (
                <>
                  <WrapperCardElement>
                    <IbanForm />
                  </WrapperCardElement>

                  <SepaText>{t('basket-pay-sepa-debit-text')}</SepaText>
                </>
              ) : (
                <WrapperCardElement>
                  <CardForm />
                </WrapperCardElement>
              )}

              {paymentErrorMsg && <ErrorPayment errorMessage={paymentErrorMsg} />}
            </Spin>
          </WrapperForm>
        </>
      )}
      <ContainerButton>
        <GradientButton onClick={previousStep} noGradient variant="outlined" fullWidth disabled={formStripePending}>
          {t('global-back')}
        </GradientButton>
        <GradientButton type="button" fullWidth onClick={handleContinueClick} disabled={formStripePending}>
          {isFreeCoupon
            ? t('basket-pay-continue')
            : selectedOption === OPTION_PAYMENT.SEPA
            ? t('basket-accept-pay')
            : t('basket-pay')}
        </GradientButton>
      </ContainerButton>
    </RectangleBox>
  );
};

export default styled(BasketPay)`
  h1 {
    font-weight: bold;
    margin-bottom: 10px;
  }

  form {
    width: 100%;
  }
`;

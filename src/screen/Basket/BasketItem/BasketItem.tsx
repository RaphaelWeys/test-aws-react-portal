import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import GradientButton from '../../../components/GradientButton';
import { Input } from '../../../components/Input';
import InvisibleButton from '../../../components/InvisibleButton';
import { useUpdateBasketCoupon } from '../../../endpoints/basket/useUpdateBasketCoupon';
import { getCurrencyFormatted } from '../../../utils/number';
import { useOrder } from '../BasketWrapper';
import {
  Divider,
  FormStyled,
  Label,
  PromoCode,
  RFO,
  RFOPrice,
  TotalLabel,
  TotalPrice,
  WrapperInput,
  WrapperTotal,
} from './BasketItem.styled';

interface Props {
  className?: string;
  nextStep: () => void;
}

const BasketItem: FC<Props> = ({ className, nextStep }) => {
  const [t] = useTranslation();
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [code, setCode] = useState<string>();
  const { order, setOrder } = useOrder();
  const { data: response, mutate: updateCoupon, error } = useUpdateBasketCoupon();
  const statusErrorUpdate = error?.response?.status;

  const handleClickOk = () => {
    updateCoupon(
      { orderId: order.id, coupon: inputValue },
      {
        onSuccess(data) {
          setOrder(data);
          setCode(inputValue);
          setShowInput(false);
        },
      },
    );
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClickOk();
    }
  };

  return (
    <div className={className}>
      {order?.items.map((item, index) => (
        <RFOPrice key={index} data-testid="wrapperPrice">
          <RFO>
            <div>{item.name}</div>
            <div>{item.description}</div>
          </RFO>
          <div>{getCurrencyFormatted(item.price)}</div>
        </RFOPrice>
      ))}

      <PromoCode>
        <FormStyled>
          <Label onClick={() => setShowInput(true)} isActive={showInput || !!code || !!order.couponCode}>
            {t('basket-item-promo-code')}
          </Label>
          {showInput && (
            <WrapperInput>
              <Input
                type="text"
                onChange={handleChangeInput}
                value={inputValue}
                onKeyPress={handleKeyPress}
                error={statusErrorUpdate ? t(`basket-item-incorrect-coupon-${statusErrorUpdate}`) : undefined}
                data-testid="inputCode"
                autoFocus
              />
              <InvisibleButton type="button" onClick={handleClickOk}>
                {t('global-ok')}
              </InvisibleButton>
            </WrapperInput>
          )}
          <span data-testid="couponCodeId">
            {(order.couponCode || (!showInput && code)) && <div>{order.couponCode || code}</div>}
          </span>
        </FormStyled>
        <span data-testid="couponValueId">
          {(order.couponValue || (!showInput && code)) && (
            <span>-{getCurrencyFormatted(order.couponValue || response?.couponValue || 0)}</span>
          )}
        </span>
      </PromoCode>

      <Divider />

      <WrapperTotal>
        <TotalLabel>
          <span>{t('basket-item-total')}</span> <span>{t('basket-item-total-no-tva')}</span>
        </TotalLabel>
        <TotalPrice>
          {getCurrencyFormatted(order.itemsAmount - (order.couponValue || response?.couponValue || 0))}
        </TotalPrice>
      </WrapperTotal>
      <GradientButton onClick={nextStep}>{t('global-next')}</GradientButton>
    </div>
  );
};

export default styled(BasketItem)`
  width: 100%;
  box-shadow: 0 0 8px #00000026;
  padding: 4rem 3.12rem 2.5rem;

  ${GradientButton} {
    margin: 0 auto;
  }

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.lg}) {
      width: 800px;
    }
  `}
`;

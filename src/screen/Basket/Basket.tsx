import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';
import styled, { css } from 'styled-components';

import marketplaceIcon from '../../assets/picto-marketplace.svg';
import optimizationIcon from '../../assets/picto-optimization.svg';
import Loader from '../../components/Loader';
import { OrderProvider } from '../../context/OrderContext';
import { useGetOrder } from '../../endpoints/basket/useGetOrder';
import MainLayout from '../../layout/MainLayout';
import { getQueryParameters } from '../../utils/url';
import AppBasket from './AppBasket';

interface Props {
  className?: string;
}

const Basket: FC<Props> = ({ className }) => {
  const [t] = useTranslation();
  const { orderId, callback } = getQueryParameters();
  const { isLoading, isError, data: order } = useGetOrder(orderId as string);

  if (!callback || order?.paid) {
    return (
      <div data-testid="redirect-component">
        <Redirect to="/" />
      </div>
    );
  }

  if (isLoading) return <Loader />;

  return (
    <MainLayout hasBg={false}>
      <div className={className}>
        {isError ? (
          <h1>{t('basket-order-not-found')}</h1>
        ) : (
          <OrderProvider>
            <AppBasket icon={order?.app === 'tender' ? marketplaceIcon : optimizationIcon} />
          </OrderProvider>
        )}
      </div>
    </MainLayout>
  );
};

export default styled(Basket)`
  width: 100%;

  h1 {
    font-weight: bold;
    text-align: center;
  }

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.lg}) {
      width: 800px;
    }
  `}
`;

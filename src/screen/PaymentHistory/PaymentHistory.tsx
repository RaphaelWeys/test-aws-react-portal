import moment from 'moment';
import React, { FC, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import marketplaceIcon from '../../assets/picto-marketplace.svg';
import optimizationIcon from '../../assets/picto-optimization.svg';
import GradientButton from '../../components/GradientButton';
import InvisibleButton from '../../components/InvisibleButton/InvisibleButton';
import Loader from '../../components/Loader';
import { useGetPaymentHistory } from '../../endpoints/user/useGetPaymentHistory';
import useContactUs from '../../hooks/useContactUs';
import MainLayout from '../../layout/MainLayout';
import { ContentButton } from './PaymentHistory.styled';
import PaymentHistoryItem from './PaymentHistoryItem';
import WrapperWhiteBox from '../../layout/WrapperWhiteBox';
import { Col, Row } from 'antd';

interface Props {
  className?: string;
}

const PaymentHistory: FC<Props> = ({ className }) => {
  const [t] = useTranslation();
  const contactUsLink = useContactUs();
  const { isLoading, data: paymentsHistory } = useGetPaymentHistory();

  const handleClickContactUs = useCallback(() => {
    window.location.assign(contactUsLink);
  }, [contactUsLink]);

  if (isLoading) {
    return (
      <MainLayout>
        <Loader />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className={className}>
        <WrapperWhiteBox title={t('payment-history-title')}>
          <Row style={{ width: '100%' }}>
            {paymentsHistory?.length > 0 && (
              <Col span={24}>
                {paymentsHistory.map((payment, index) =>
                  payment.items.map((item) => (
                    <PaymentHistoryItem
                      key={index}
                      icon={payment.app === 'tender' ? marketplaceIcon : optimizationIcon}
                      startDate={moment(payment.createdAt).format('DD/MM/YYYY')}
                      title={item.name}
                      description={item.description}
                      amount={payment.amountToPay}
                      urlToRedirect={payment.receiptUrl}
                      isLast={paymentsHistory.length - 1 === index}
                    />
                  )),
                )}
              </Col>
            )}
            <Col>{paymentsHistory?.length === 0 && <div>{t('payment-history-no-order-found')}</div>}</Col>
          </Row>
        </WrapperWhiteBox>

        <GradientButton fullWidth noButton>
          <ContentButton>
            <div>{t('payment-history-button-1')}</div>
            <div>
              {t('payment-history-button-2')}
              <InvisibleButton onClick={handleClickContactUs}>{t('payment-history-button-3')}</InvisibleButton>
            </div>
          </ContentButton>
        </GradientButton>
      </div>
    </MainLayout>
  );
};

export default styled(PaymentHistory)`
  && {
    width: 100%;
    margin-bottom: 3.3rem;

    ${GradientButton} {
      height: 9.3rem;
      display: flex;
      justify-content: center;
      text-align: center;
      border-radius: 20px;
      margin-top: 2.5rem;
      padding: 1.87rem;
      font-weight: normal;

      :hover {
        cursor: default;
      }
      > div > :first-child {
        font-size: 1.25rem;
        margin-bottom: 1.25rem;
      }
      > div > :nth-child(2) {
        font-size: 1rem;
      }
    }
    ${({ theme: { breakpoints } }) => css`
      @media (min-width: ${breakpoints.lg}) {
        width: 990px;
      }
    `}
  }

  ${InvisibleButton} {
    display: inline-block;
    text-decoration: underline;
  }
`;

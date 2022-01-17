import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import DownloadIcon from '../../../components/icons/DownloadIcon';
import InvisibleButton from '../../../components/InvisibleButton';
import { getCurrencyFormatted } from '../../../utils/number';
import { Center, CenterPrice, Date, Icon, Title } from './PaymentHistoryItem.styled';

interface Props {
  className?: string;
  icon: string;
  startDate: string;
  title: string;
  description: string;
  amount: number;
  urlToRedirect: string;
}

const PaymentHistoryItem: FC<Props> = ({ className, icon, startDate, title, description, amount, urlToRedirect }) => {
  const [t] = useTranslation();
  const handleClickDownload = () => {
    const win = window.open(urlToRedirect, '_blank');
    if (win) win.focus();
  };

  return (
    <div className={className} data-testid="payment-history-item">
      <Center>
        <Icon>
          <img alt="picto logo" src={icon} />
        </Icon>
        <Date>{startDate}</Date>
        <Title>
          <div>{title}</div>
          {description && (
            <div>
              {t('payment-history-reference')}: {description}
            </div>
          )}
        </Title>
      </Center>
      <CenterPrice>
        <div data-testid="price-test">{getCurrencyFormatted(amount)}</div>
        {urlToRedirect && (
          <InvisibleButton data-testid="button-download" onClick={handleClickDownload}>
            <DownloadIcon />
          </InvisibleButton>
        )}
      </CenterPrice>
    </div>
  );
};

export default styled(PaymentHistoryItem)<{ isLast: boolean }>`
  ${({ isLast }) => css`
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: flex-start;
    padding: 16px 16px 13px;
    border-top: 2px dotted black;
    ${isLast && 'border-bottom: 2px dotted black'};

    ${({ theme: { breakpoints } }) => css`
      @media (min-width: ${breakpoints.sm}) {
        flex-direction: row;
        align-items: center;
      }
    `}
  `}

  ${InvisibleButton} {
    margin-left: 30px;
  }
`;

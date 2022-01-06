import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Center, Date, Icon, Title, CenterPrice } from './PaymentHistoryItem.styled';
import InvisibleButton from '../../../components/InvisibleButton';
import DownloadIcon from '../../../components/icons/DownloadIcon';
import { getCurrencyFormatted } from '../../../utils/number';

interface Props {
  className?: string;
  icon: string;
  startDate: string;
  title: string;
  description: string;
  amount: number;
  urlToRedirect: string;
  isLast: boolean;
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
          <img src={icon} alt="picto logo" />
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

export default styled(PaymentHistoryItem)`
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

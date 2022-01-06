import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import GradientButton from '../../../components/GradientButton';
import RectangleBox from '../../../layout/RectangleBox';
import { getQueryParameters } from '../../../utils/url';

interface Props {
  className?: string;
  text: string;
}

const BasketValidate: FC<Props> = ({ className, text }) => {
  const [t] = useTranslation();
  const { callback } = getQueryParameters();

  return (
    <div className={className}>
      <RectangleBox showLogo={false} title={t('basket-validate-title')}>
        <p>{text}</p>
        <GradientButton
          onClick={() => {
            if (callback) window.location.assign(callback as string);
          }}
        >
          {t('global-continue')}
        </GradientButton>
      </RectangleBox>
    </div>
  );
};

export default styled(BasketValidate)`
  width: 100%;
  margin-top: 40px;

  h1 {
    margin-bottom: 20px;
    font-weight: bold;
  }
  p {
    margin-bottom: 30px;
    text-align: center;
    color: #3c3c3c;
  }

  ${({ theme: { breakpoints } }) => css`
    @media (min-width: ${breakpoints.lg}) {
      width: 800px;
    }
  `}
`;

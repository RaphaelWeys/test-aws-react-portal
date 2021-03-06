import { ArrowLeftOutlined } from '@ant-design/icons';
import { Space } from 'antd';
import React, { FC, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled, { css, ThemeContext } from 'styled-components';

import InvisibleButton from '../../components/InvisibleButton';
import { useScroll } from '../../context/ScrollContext';
import { optionsGetSignaturePackClient, optionsGetSignaturePackSupplier } from '../../endpoints/signature';
import useRequest from '../../hooks/useRequest';
import { SignaturePackClient, SignaturePackSupplier } from '../../interface/signature';
import { getQueryParameters } from '../../utils/url';
import Client from './Client';
import Supplier from './Supplier';

interface Props {
  className?: string;
}

export type SignersForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ValidatorsForm = Omit<SignersForm, 'phone'>;

let intervalId: any = 0;

function isClient(signaturePack: SignaturePackSupplier | SignaturePackClient): signaturePack is SignaturePackClient {
  return (signaturePack as SignaturePackClient).documentSupplierName !== undefined;
}

const SignatureRfo: FC<Props> = ({ className }) => {
  const themeContext = React.useContext(ThemeContext);
  const [t] = useTranslation();
  const scroll = useScroll();
  const { user } = useParams<{ user: string }>();
  const { callback, packId } = getQueryParameters();
  const options = user === 'supplier' ? optionsGetSignaturePackSupplier(packId) : optionsGetSignaturePackClient(packId);
  const { request: getSignaturePack, response: signaturePack } = useRequest<
    SignaturePackSupplier | SignaturePackClient
  >(options);
  const status = signaturePack?.currentVersion?.docSupplierStatus || signaturePack?.currentVersion?.docSupplierStatus;

  const handleClickBack = useCallback(() => {
    window.location.assign(callback as string);
  }, [callback]);

  useEffect(() => {
    intervalId = setInterval(() => {
      getSignaturePack();
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [getSignaturePack]);

  useEffect(() => {
    getSignaturePack();
  }, [getSignaturePack]);

  useEffect(() => {
    if (scroll)
      scroll.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  }, [status, scroll]);

  if (!signaturePack) {
    return null;
  }

  return (
    <div className={className}>
      <Space direction="vertical" size="middle">
        <InvisibleButton onClick={() => handleClickBack()}>
          <b style={{ color: themeContext.colors.baseColor }}>
            <Space>
              <ArrowLeftOutlined />
              <span>{t('global-back')}</span>
            </Space>
          </b>
        </InvisibleButton>
        {isClient(signaturePack) && (
          <Client getSignaturePack={getSignaturePack} packId={packId as string} signaturePack={signaturePack} />
        )}
        {!isClient(signaturePack) && (
          <Supplier getSignaturePack={getSignaturePack} packId={packId as string} signaturePack={signaturePack} />
        )}
      </Space>
    </div>
  );
};

export default styled(SignatureRfo)`
  ${({ theme: { colors, breakpoints } }) => css`
    margin: 1rem auto 3.3rem;
    padding: 10px;

    h1,
    h2,
    h3 {
      color: ${colors.baseColor};
      font-weight: bold;
    }

    @media (min-width: ${breakpoints.lg}) {
      width: 990px;
    }
  `}
`;

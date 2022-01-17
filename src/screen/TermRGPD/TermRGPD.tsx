import React from 'react';
import { useTranslation } from 'react-i18next';

import SafeHTMLTranslate from '../../components/SafeHTMLTranslate';
import { useTenant } from '../../context/TenantContext';
import MainLayout from '../../layout/MainLayout';
import WrapperWhiteBox from '../../layout/WrapperWhiteBox';
import { Navigation } from '../../navigation';
import { TextRegular } from '../../style/utils';

const TermRGPD = () => {
  const [t] = useTranslation();
  const { tenantName } = useTenant();

  return (
    <MainLayout>
      <WrapperWhiteBox
        backButtonText={t('global-back')}
        title={t(`modal-rgpd-${tenantName}-title`)}
        to={localStorage.getItem('callback') || Navigation.DASHBOARD}
      >
        <TextRegular>
          <SafeHTMLTranslate template={`modal-rgpd-${tenantName}-description-info`} />
        </TextRegular>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default TermRGPD;

import React from 'react';
import SafeHTMLTranslate from '../../components/SafeHTMLTranslate';
import MainLayout from '../../layout/MainLayout';
import WrapperWhiteBox from '../../layout/WrapperWhiteBox';
import { TextRegular } from '../../style/utils';
import { useTranslation } from 'react-i18next';
import { Navigation } from '../../navigation';
import { useTenant } from '../../context/TenantContext';

const TermRGPD = () => {
  const [t] = useTranslation();
  const { tenantName } = useTenant();

  return (
    <MainLayout>
      <WrapperWhiteBox
        backButtonText={t('global-back')}
        to={localStorage.getItem('callback') || Navigation.DASHBOARD}
        title={t(`modal-rgpd-${tenantName}-title`)}
      >
        <TextRegular>
          <SafeHTMLTranslate template={`modal-rgpd-${tenantName}-description-info`} />
        </TextRegular>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default TermRGPD;

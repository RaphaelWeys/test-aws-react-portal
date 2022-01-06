import React from 'react';
import { useTranslation } from 'react-i18next';
import SafeHTMLTranslate from '../../components/SafeHTMLTranslate';
import { useTenant } from '../../context/TenantContext';
import MainLayout from '../../layout/MainLayout';
import WrapperWhiteBox from '../../layout/WrapperWhiteBox';
import { Navigation } from '../../navigation/index';
import { TextRegular } from '../../style/utils';

const TermCGU = () => {
  const [t] = useTranslation();
  const { tenantName } = useTenant();

  return (
    <MainLayout>
      <WrapperWhiteBox
        backButtonText={t('global-back')}
        to={localStorage.getItem('callback') || Navigation.DASHBOARD}
        title={t(`modal-cgu-${tenantName}-title`)}
      >
        <TextRegular>
          <SafeHTMLTranslate template={`modal-cgu-${tenantName}-description-info`} />
        </TextRegular>
      </WrapperWhiteBox>
    </MainLayout>
  );
};

export default TermCGU;

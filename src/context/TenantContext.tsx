import { changeAntdTheme } from 'mini-dynamic-antd-theme';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import { useGetTenantInfo } from '../endpoints/tenant/useGetTenantInfo';
import theme, { overrideTheme } from '../style/theme';

const TenantContext = React.createContext(null);

// const domain = 'demo.optimization.energy';
const domain = window.location.hostname;
const regex = /optimization.energy$/;
const shouldGetTenantInfo = domain.match(regex);

const TenantProvider = ({ children }) => {
  const [customTheme, setCustomTheme] = React.useState(theme);
  const [isDomainMA, setIsDomainMA] = React.useState(false);
  const [favicon, setFavicon] = React.useState('');
  const [siteTitle, setSiteTitle] = React.useState('');
  const [tenantName, setTenantName] = React.useState<string | undefined>();
  const [environmentVariables, setEnvironmentVariables] = React.useState(process.env);
  const { mutate: getTenantInfo, isSuccess: getTenantInfoSucceed } = useGetTenantInfo();

  React.useEffect(() => {
    if (!shouldGetTenantInfo) {
      return;
    }

    getTenantInfo(
      { domain },
      {
        onSuccess(data) {
          setEnvironmentVariables((variables) => ({
            ...variables,
            ...data.env,
          }));
          setIsDomainMA(true);
          setSiteTitle(data.siteTitle);
          setFavicon(data.favicon);
          setTenantName(data.tenant);
        },
        onSettled(data) {
          if (data) {
            const { dashboardLogo, loginLogo, ...colors } = data.theme;
            const logo = {
              dashboard: dashboardLogo,
              login: loginLogo,
            };
            setCustomTheme(() => overrideTheme(logo, colors));
            changeAntdTheme(data.theme.baseColor);
          } else {
            changeAntdTheme(theme.colors.baseColor);
          }
        },
      },
    );
  }, [getTenantInfo]);

  if (!getTenantInfoSucceed && shouldGetTenantInfo) {
    return null;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <TenantContext.Provider value={{ env: environmentVariables, isDomainMA, favicon, siteTitle, tenantName }}>
        {children}
      </TenantContext.Provider>
    </ThemeProvider>
  );
};

function useTenant() {
  const context = React.useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export { TenantContext, TenantProvider, useTenant };

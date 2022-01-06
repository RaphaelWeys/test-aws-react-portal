export interface TenantInfo {
  domain: string;
  favicon: string;
  tenant: string;
  siteTitle: string;
  env: {
    [key: string]: string;
  };
  theme: {
    baseColor: string;
    dashboardLogo: string;
    header: string;
    headerLinkActive: string;
    headerLinkHover: string;
    headerLinkInactive: string;
    lineGraph: string;
    lineGraphBackground: string;
    loginLogo: string;
  };
}

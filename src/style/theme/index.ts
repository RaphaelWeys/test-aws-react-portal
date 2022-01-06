import breakpoints from './breakpoints';
import colors from './colors';
import fontSize from './fontSize';

const theme = {
  breakpoints,
  colors,
  fontSize,
  logo: {
    dashboard: '/images/default-logo-YEM.svg',
    login: '/images/default-logo-YEM-login.svg',
  },
};

interface Logo {
  dashboard: string;
  login: string;
}

interface CustomColors {}

export const overrideTheme = (logo: Logo, customColors: CustomColors) => ({
  ...theme,
  logo,
  colors: {
    ...theme.colors,
    ...customColors,
  },
});

export default theme;
